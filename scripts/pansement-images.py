# Régénérer : python3 scripts/pansement-images.py [clé ...] (numpy et Pillow requis)
# Rendu d'images de synthèse réalistes pour l'outil « Choix du pansement » (pas des photographies).
# Chaque image = albédo (couleur), carte de hauteur (relief), carte d'humidité (reflets) puis éclairage.
# Usage : python3 parender.py [clé ...]  → www/img/pansement/<clé>.webp
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFilter
W, H = 600, 450
OUT = "/home/user/Essai/www/img/pansement"
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

def sstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def mix(a, b, t):
    t = t[..., None] if np.ndim(t) == 2 else t
    return a * (1 - t) + b * t
def C(*rgb): return np.array(rgb, np.float32) / 255
def box1(a, r, axis):
    if r < 1: return a
    pad = [(0, 0)] * a.ndim; pad[axis] = (r + 1, r); b = np.pad(a, pad, mode="edge")
    c = np.cumsum(b, axis=axis, dtype=np.float64); n = a.shape[axis]
    hi = np.take(c, np.arange(2 * r + 1, 2 * r + 1 + n), axis=axis); lo = np.take(c, np.arange(0, n), axis=axis)
    return ((hi - lo) / (2 * r + 1)).astype(np.float32)
def gblur(a, sigma):
    """flou gaussien approché (3 flous en boîte), pour des tableaux 2D float"""
    if sigma <= 0: return a
    r = max(1, int(round(np.sqrt(12 * sigma * sigma / 3 + 1) / 2 - .5)))
    for _ in range(3): a = box1(box1(a, r, 0), r, 1)
    return a
def vnoise(scale, seed):
    r = np.random.default_rng(seed); gw, gh = int(W / scale) + 3, int(H / scale) + 3
    g = r.random((gh, gw)).astype(np.float32)
    im = Image.fromarray(g).resize((int((gw - 1) * scale), int((gh - 1) * scale)), Image.BICUBIC)
    return np.asarray(im, np.float32)[:H, :W]
def fbm(scale, oct, seed, gain=.5):
    s = np.zeros((H, W), np.float32); a = 1; t = 0
    for i in range(oct):
        s += vnoise(max(scale / 2 ** i, 1.2), seed + i * 17) * a; t += a; a *= gain
    return s / t
def worley(cell, seed, jit=.9):
    r = np.random.default_rng(seed); gx, gy = int(W // cell) + 3, int(H // cell) + 3
    base = np.stack(np.meshgrid(np.arange(gx), np.arange(gy)), -1).astype(np.float32)
    pts = (base + .5 + (r.random((gy, gx, 2)) - .5) * jit) * cell
    cx, cy = (xx // cell).astype(int), (yy // cell).astype(int)
    F1 = np.full((H, W), 1e9, np.float32); F2 = F1.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            ix = np.clip(cx + dx, 0, gx - 1); iy = np.clip(cy + dy, 0, gy - 1); p = pts[iy, ix]
            d = np.hypot(xx - p[..., 0], yy - p[..., 1])
            F2 = np.where(d < F1, F1, np.minimum(F2, d)); F1 = np.minimum(F1, d)
    return F1 / cell, F2 / cell
def blob(cx, cy, R, seed, irr=.16, ax=1., ay=.8, rot=0., fine=.05):
    r = np.random.default_rng(seed); c, s = np.cos(rot), np.sin(rot)
    dx, dy = (xx - cx) * c + (yy - cy) * s, -(xx - cx) * s + (yy - cy) * c
    dx, dy = dx / ax, dy / ay; th = np.arctan2(dy, dx); rho = np.hypot(dx, dy)
    rr = np.ones_like(th)
    for k in range(2, 8): rr += (irr / k ** .8) * np.sin(k * th + r.random() * 6.28)
    rr += fine * (vnoise(14, seed + 3) - .5)
    return (rho - R * rr) / R

class Scene:
    def __init__(s, bg=None):
        s.A = np.zeros((H, W, 3), np.float32); s.Hh = np.zeros((H, W), np.float32)
        s.S = np.zeros((H, W), np.float32); s.N = np.full((H, W), 30, np.float32)
        s.shade = np.ones((H, W), np.float32)
        if bg is not None: s.A[:] = bg
    # ---- peau ----
    def skin(s, tone=(226, 178, 150), seed=1, m=None, rough=.35):
        base = C(*tone); low = fbm(170, 3, seed); mid = fbm(45, 3, seed + 5); fine = fbm(6, 2, seed + 7)
        A = base * (1 + (low[..., None] - .5) * np.array([.08, .12, .14])) * (1 + (mid[..., None] - .5) * np.array([.05, .07, .08]))
        red = sstep(.55, .85, fbm(110, 2, seed + 9)); A = mix(A, A * C(255, 214, 206) / C(255, 255, 255), red * .4)
        A = A * (1 + (fine[..., None] - .5) * .05)
        pores = sstep(.86, .97, vnoise(1.7, seed + 11)); A = A * (1 - pores[..., None] * .07)
        w1 = np.abs(np.sin((xx * .8 + yy * .55) / 7 + fbm(90, 2, seed + 13) * 2.5)); w2 = np.abs(np.sin((xx * .55 - yy * .8) / 8 + fbm(90, 2, seed + 14) * 2.5))
        lines = (sstep(.975, 1, w1) + sstep(.978, 1, w2) * .8) * sstep(.3, .6, fbm(80, 2, seed + 16)) * .7
        A = A * (1 - lines[..., None] * .05)
        h = (fbm(4, 2, seed + 15) - .5) * rough - pores * .25 - lines * .22
        if m is None: s.A[:] = A; s.Hh += h; s.S[:] = .07; s.N[:] = 14
        else:
            s.A = mix(s.A, A, m); s.Hh += h * m; s.S = s.S * (1 - m) + .07 * m; s.N = np.where(m > .5, 14, s.N)
    def tint(s, mask, col, amt): s.A = mix(s.A, np.broadcast_to(C(*col), s.A.shape), np.clip(mask * amt, 0, 1))
    def erythema(s, d, width=.5, amt=.55, col=(196, 72, 60)):
        e = np.exp(-np.clip(d, 0, None) / width) * (d > -.05); s.tint(e, col, amt); return e
    # ---- plaie : creuse le relief et renvoie le masque intérieur ----
    def crater(s, d, depth=10, wall=.3, lip=.4, rim_col=(200, 120, 112), rim=.25):
        inside = sstep(.02, -.02, d); bowl = sstep(.01, -wall, d) ** 1.3
        s.Hh = s.Hh * (1 - inside) - depth * bowl + lip * np.exp(-(d / .035) ** 2)
        band = np.exp(-(d / .05) ** 2) * (d > -.08); s.tint(band, rim_col, rim)
        s.shade *= 1 - .18 * np.exp(-((d + .07) / .06) ** 2) * inside  # ombre sous la berge
        return inside, bowl
    # ---- tissus ----
    def granulation(s, m, seed=3, cell=9, dark=0., dull=0.):
        F1a, _ = worley(cell * 1.7, seed); F1b, _ = worley(cell * .7, seed + 1); w = fbm(24, 3, seed + 7)
        g = np.clip(1 - F1a * 1.15, 0, 1) ** 1.4 * .7 + np.clip(1 - F1b * 1.2, 0, 1) ** 1.2 * .35 + (w - .5) * .3
        patch = fbm(60, 3, seed + 9)
        A = mix(C(112, 16, 20), C(198, 40, 40), np.clip(g * 1.1, 0, 1))
        A = mix(A, C(222, 84, 80), sstep(.62, .9, g) * .45)
        A = mix(A, C(150, 30, 34) * .8, sstep(.55, .8, patch) * .35)
        if dark: A = A * (1 - dark)
        if dull: A = mix(A, C(168, 86, 76), dull)
        s.A = mix(s.A, A, m); s.Hh += (g * 3.2 + patch * 1.5) * m
        wet = (.55 - dull * .4) * (.65 + .35 * vnoise(4, seed + 11))
        s.S = s.S * (1 - m) + wet * m; s.N = np.where(m > .5, 34, s.N)
    def slough(s, m, seed=4, col=(236, 214, 156), wet=.24):
        f = fbm(22, 4, seed); ang = fbm(90, 2, seed + 2) * 6
        st = np.abs(np.sin((xx * np.cos(ang) + yy * np.sin(ang)) / 2.6 + fbm(30, 2, seed + 3) * 8))
        A = mix(C(*col) * .86, C(*col), f)
        A = mix(A, C(242, 232, 196), sstep(.62, .9, f) * .55)
        A = A * (1 - sstep(.86, 1, st)[..., None] * .09) + sstep(.9, 1, st)[..., None] * .03
        A = mix(A, C(205, 168, 98), sstep(.6, .85, fbm(48, 2, seed + 5)) * .35)
        a = np.clip(m * sstep(.25, .6, f + .25), 0, 1)
        s.A = mix(s.A, A, a); s.Hh = s.Hh * (1 - .8 * a) + (1.4 + gblur(f, 2) * 1.1 + st * .3) * a
        s.S = s.S * (1 - a) + wet * (.7 + .3 * f) * a; s.N = np.where(a > .5, 12, s.N)
    def necrosis(s, m, seed=5, wet=.16, raise_=4.):
        F1, F2 = worley(58, seed); f = fbm(40, 4, seed + 1)
        crack = (1 - sstep(0, .035, F2 - F1)) * sstep(.45, .6, fbm(30, 2, seed + 4))
        wr = np.abs(np.sin((xx * .6 + yy * .8) / 3.2 + fbm(40, 3, seed + 6) * 14)); wrink = sstep(.82, 1, wr) * .6
        A = mix(C(28, 18, 16), C(84, 52, 38), f * .9)
        A = mix(A, C(108, 64, 44), sstep(.72, .92, fbm(14, 2, seed + 3)) * .3)
        A = A * (1 - wrink[..., None] * .18); A = mix(A, C(96, 30, 26), crack * .8)
        s.A = mix(s.A, A, m); s.Hh = s.Hh * (1 - .85 * m) + (raise_ + f * 2.2 - crack * 2.6 - wrink * .6) * m
        s.S = s.S * (1 - m) + wet * m; s.N = np.where(m > .5, 9, s.N)
    def epith(s, m, seed=6):
        f = fbm(18, 3, seed); A = mix(C(214, 132, 130), C(238, 182, 176), f)
        A = mix(A, C(246, 220, 216), sstep(.62, .9, fbm(7, 2, seed + 2)) * .2)
        s.A = mix(s.A, A, m); s.Hh += (f * .6 + .9) * m; s.S = s.S * (1 - m) + .42 * m; s.N = np.where(m > .5, 48, s.N)
    def fluid(s, m, col, gloss=1., height=1.5, n=90):
        s.A = mix(s.A, np.broadcast_to(C(*col), s.A.shape), m); s.Hh = s.Hh * (1 - m) + (s.Hh + height) * m
        s.Hh = gblur(s.Hh, .8)
        s.S = s.S * (1 - m) + gloss * m; s.N = np.where(m > .5, n, s.N)
    # ---- éclairage ----
    def render(s, key, vignette=.18, light=(-.55, -.62, .56), ambient=.5, diff=.62, blur=0):
        h = gblur(s.Hh, .8)
        gy, gx = np.gradient(h); n = np.dstack([-gx, -gy, np.ones_like(h)]); n /= np.linalg.norm(n, axis=2, keepdims=True)
        L = np.array(light, np.float32); L /= np.linalg.norm(L); V = np.array([0, 0, 1], np.float32)
        Hv = (L + V) / np.linalg.norm(L + V)
        nd = np.clip((n * L).sum(2), 0, 1); sp = np.clip((n * Hv).sum(2), 0, 1) ** s.N * s.S
        ao = np.clip(1 - (gblur(h, 6) - h) * .035, .55, 1.05)
        lit = s.A * (ambient + diff * nd)[..., None] * (s.shade * ao)[..., None]
        sss = np.dstack([gblur(lit[..., i], r) for i, r in enumerate((3.2, 1.8, 1.2))]); lit = lit * .55 + sss * .45
        col = lit + sp[..., None] * np.array([1, .97, .94]) * .85
        v = 1 - vignette * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 2
        col = np.clip(col * v[..., None] * 1.06, 0, 1) ** (1 / 1.04)
        im = Image.fromarray((col * 255).astype(np.uint8))
        if blur: im = im.filter(ImageFilter.GaussianBlur(blur))
        os.makedirs(OUT, exist_ok=True); im.save(f"{OUT}/{key}.webp", "WEBP", quality=80, method=6); return im

# ======================== Fonds de plaie ========================
def bed_noir():
    s = Scene(); s.skin(seed=21); d = blob(300, 228, 150, 31, irr=.14, ax=1.05, ay=.78, rot=.15)
    s.erythema(d, .35, .4)
    inside, bowl = s.crater(d, depth=3, wall=.14, lip=.6, rim=.45, rim_col=(176, 66, 56))
    core = sstep(-.035, -.085, d)  # plaque noire au centre, liseré rouge et jaune au bord (sillon d'élimination)
    band = inside * (1 - core); s.granulation(band, seed=8, cell=6); s.slough(band * sstep(.62, .75, fbm(10, 2, 4)), seed=9)
    s.necrosis(core, seed=33, raise_=5); return s.render("noir")
def bed_jaune():
    s = Scene(); s.skin(seed=22); d = blob(300, 228, 160, 41, irr=.17, ax=1.1, ay=.75, rot=-.1)
    s.erythema(d, .4, .45); inside, bowl = s.crater(d, depth=12, wall=.22, rim=.45)
    s.granulation(inside, seed=12, cell=8)
    cover = inside * sstep(.38, .5, fbm(55, 4, 7) + (-d) * .55)
    s.slough(cover, seed=13); return s.render("jaune")
def bed_rouge():
    s = Scene(); s.skin(seed=23); d = blob(300, 226, 152, 51, irr=.15, ax=1.08, ay=.8, rot=.2)
    s.erythema(d, .3, .3); inside, bowl = s.crater(d, depth=10, wall=.2, rim=.35, rim_col=(205, 120, 115))
    s.granulation(inside, seed=14, cell=8.5)
    marg = inside * sstep(-.06, -.0, d) ; s.epith(marg * .8, seed=4)
    return s.render("rouge")
def bed_rose():
    s = Scene(); s.skin(seed=24); d = blob(300, 228, 150, 61, irr=.16, ax=1.1, ay=.78)
    s.erythema(d, .2, .18, col=(214, 120, 110))
    healing = sstep(.03, -.05, d); s.Hh -= 2.5 * sstep(.02, -.25, d)
    s.epith(healing * (.55 + .45 * sstep(0, -.25, d)), seed=7)
    s.tint(np.exp(-((d + .015) / .025) ** 2), (190, 110, 140), .35)  # liseré violacé de l'épiderme qui avance
    inner = blob(318, 232, 62, 71, irr=.25, ax=1.2, ay=.7, rot=.3)
    gm = sstep(.03, -.05, inner); s.Hh -= 4 * sstep(.03, -.2, inner); s.granulation(gm, seed=15, cell=7)
    isl = healing * sstep(.86, .93, fbm(18, 2, 5)) * sstep(.0, .05, inner); s.epith(isl, seed=9)
    return s.render("rose")

# ======================== Outils de scène ========================
def poly_mask(pts, blur=1.5):
    im = Image.new("L", (W, H), 0); ImageDraw.Draw(im).polygon([tuple(p) for p in pts], fill=255)
    return gblur(np.asarray(im, np.float32) / 255, blur)
def ell_mask(cx, cy, rx, ry, blur=1.5, rot=0):
    im = Image.new("L", (W, H), 0); dr = ImageDraw.Draw(im)
    if rot:
        t = np.linspace(0, 2 * np.pi, 90); c, s_ = np.cos(rot), np.sin(rot)
        dr.polygon([(cx + rx * np.cos(a) * c - ry * np.sin(a) * s_, cy + rx * np.cos(a) * s_ + ry * np.sin(a) * c) for a in t], fill=255)
    else: dr.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
    return gblur(np.asarray(im, np.float32) / 255, blur)
def cloth(s, col=(120, 150, 170), seed=90, fold=1.):
    f = fbm(120, 3, seed); weave = (np.sin(xx * 1.9) * np.sin(yy * 1.9)) * .5 + .5
    s.A[:] = C(*col) * (.9 + .16 * f[..., None]) * (.96 + .05 * weave[..., None]); s.Hh += f * 18 * fold + weave * .3; s.S[:] = .03; s.N[:] = 8
def body(s, m, seed=1, vol=26, tone=(226, 178, 150)):
    s.skin(tone=tone, seed=seed, m=m); s.Hh += gblur(m, 22) * vol
    sh = gblur(m, 6); s.shade *= np.clip(1 - (1 - sh) * .0 + 0, 0, 1)
    drop = np.roll(np.roll(gblur(m, 10), 8, 0), 6, 1) * (1 - m); s.shade *= 1 - drop * .35
def gauze(s, cx, cy, w, h, rot, seed=7):
    c, s_ = np.cos(rot), np.sin(rot); pts = [(cx + (x * c - y * s_), cy + (x * s_ + y * c)) for x, y in ((-w, -h), (w, -h), (w, h), (-w, h))]
    m = poly_mask(pts, 1.2); u = (xx - cx) * c + (yy - cy) * s_; v = -(xx - cx) * s_ + (yy - cy) * c
    th = sstep(.55, 1, np.abs(np.sin(u * np.pi / 4.2))) * .6 + sstep(.55, 1, np.abs(np.sin(v * np.pi / 4.2))) * .6
    holes = (1 - sstep(.1, .35, np.abs(np.sin(u * np.pi / 4.2)))) * (1 - sstep(.1, .35, np.abs(np.sin(v * np.pi / 4.2))))
    f = fbm(40, 3, seed); A = C(246, 245, 238) * (.92 + .08 * f[..., None]) * (1 - holes[..., None] * .12) * (1 - th[..., None] * .05)
    fold = np.abs(u / w) ** 6 * 4 + np.abs(v / h) ** 6 * 4
    drop = np.roll(np.roll(gblur(m, 9), 10, 0), 7, 1) * (1 - m); s.shade *= 1 - drop * .45
    s.A = mix(s.A, A, m); s.Hh = s.Hh * (1 - m) + (6 + th * .9 - holes * .5 + f * 2 + fold) * m; s.S = s.S * (1 - m) + .04 * m; s.N = np.where(m > .5, 10, s.N)
    return m, u, v
def stain(s, m, a, col=(214, 182, 104), tide=.35, wet=.0):
    a = np.clip(a, 0, 1) * m; ring = np.clip(gblur(a, 2) - gblur(a, 7), 0, 1) * 3
    tint = C(*col); s.A = s.A * (1 - a[..., None] * .55) + s.A * tint * a[..., None] * .55
    s.A = s.A * (1 - np.clip(ring * tide, 0, .5)[..., None] * (1 - tint) * 1.2)
    if wet: s.S = s.S + a * wet; s.N = np.where(a > .4, 40, s.N)
def staple(s, x, y, w=16, h=7, rot=0, t=2.4):
    c, s_ = np.cos(rot), np.sin(rot); m = np.zeros((H, W), np.float32)
    for a, b in ((-w, 0), (w, 0)):
        m = np.maximum(m, ell_mask(x + a * c, y + a * s_, t + .6, t + .6, .6))
    seg = poly_mask([(x - w * c - t * s_, y - w * s_ + t * c), (x + w * c - t * s_, y + w * s_ + t * c), (x + w * c + t * s_, y + w * s_ - t * c), (x - w * c + t * s_, y - w * s_ - t * c)], .6)
    mm = np.maximum(m, seg); sh = np.roll(np.roll(gblur(mm, 2.5), 3, 0), 2, 1) * (1 - mm); s.shade *= 1 - sh * .35
    s.A = mix(s.A, np.broadcast_to(C(170, 176, 186), s.A.shape), mm); s.Hh += gblur(mm, 1.2) * 5; s.S = s.S * (1 - mm) + 1.2 * mm; s.N = np.where(mm > .5, 70, s.N)

# ======================== Exsudat sur la compresse ========================
def exu(key, level):
    s = Scene(); cloth(s, seed=91); m, u, v = gauze(s, 300, 225, 175, 128, -.06)
    if level == "sec": s.tint(m * sstep(.85, .95, fbm(10, 2, 5)), (196, 170, 140), .25)
    else:
        r = {"faible": 52, "modere": 104, "abondant": 190}[level]
        d = blob(305, 228, r, 120 + r, irr=.22, ax=1.25, ay=.95, rot=.2); a = sstep(.06, -.06, d)
        if level == "abondant": a = np.maximum(a, m * .55)
        stain(s, m, a * (.75 if level == "faible" else .95), col=(212, 176, 92), tide=.5 if level != "faible" else .35, wet=.25 if level == "abondant" else 0)
        if level == "abondant":
            out = sstep(.04, -.06, blob(470, 330, 70, 7, irr=.3, ax=1.3, ay=.6)) * (1 - m)
            s.A = s.A * (1 - out[..., None] * .35); s.S += out * .5; s.N = np.where(out > .4, 50, s.N)
    s.render(key, vignette=.12)
def exu_sec(): exu("sec", "sec")
def exu_faible(): exu("faible", "faible")
def exu_modere(): exu("modere", "modere")
def exu_abondant(): exu("abondant", "abondant")

# ======================== Particularités ========================
def fl_inf():
    s = Scene(); s.skin(seed=31, tone=(224, 172, 146)); d = blob(300, 226, 100, 81, irr=.18, ax=1.1, ay=.8)
    e = s.erythema(d, 1.4, .62, col=(200, 60, 52)); s.Hh += np.exp(-np.clip(d, 0, None) / 1.2) * 6 * (d > 0); s.S += e * .12; s.N = np.where(e > .3, 30, s.N)
    inside, bowl = s.crater(d, depth=8, wall=.3, rim=.3); s.granulation(inside, seed=16, cell=8, dull=.35)
    s.slough(inside * sstep(.5, .64, fbm(30, 3, 3)), seed=17)
    pus = inside * sstep(.66, .76, fbm(18, 2, 8)); s.fluid(pus, (226, 214, 150), gloss=.9, height=1.2, n=70)
    pen = blob(300, 226, 200, 85, irr=.08, ax=1.2, ay=.92); line = np.exp(-(pen / .012) ** 2) * sstep(.4, .6, np.sin(np.arctan2(yy - 226, xx - 300) * 40) * .5 + .5)
    s.tint(line, (46, 56, 110), .85); s.render("inf")
def fl_sang():
    s = Scene(); s.skin(seed=32); d = blob(300, 210, 120, 91, irr=.16, ax=1.1, ay=.8)
    s.erythema(d, .3, .3); inside, bowl = s.crater(d, depth=9, wall=.3); s.granulation(inside, seed=18, cell=8)
    pool = inside * sstep(.03, -.05, blob(286, 236, 58, 9, irr=.35, ax=1.35, ay=.72)) * sstep(.3, .45, fbm(14, 2, 3) + .15)
    path = 300 + 10 * np.sin((yy - 280) / 24); drip = np.exp(-((xx - path) / (3.5 + (yy - 280) * .012)) ** 2) * sstep(276, 290, yy) * sstep(392, 372, yy) * (1 - inside)
    tipd = ell_mask(300 + 10 * np.sin(100 / 24), 384, 7, 9, 2) * (1 - inside)
    s.fluid(np.clip(pool + drip + tipd, 0, 1), (132, 6, 12), gloss=1.3, height=2.4, n=120); s.render("sang")

def fl_cav():
    s = Scene(); s.skin(seed=33); d = blob(300, 226, 118, 101, irr=.15, ax=1.1, ay=.82)
    s.erythema(d, .3, .3); inside, bowl = s.crater(d, depth=34, wall=.5, rim=.3)
    s.granulation(inside, seed=19, cell=8, dark=.25)
    under = inside * sstep(-.25, -.02, d) * sstep(.1, .5, np.cos(np.arctan2(yy - 226, xx - 300) - 2.3)); s.shade *= 1 - under * .75
    s.A = mix(s.A, s.A * .4, inside * sstep(-.1, -.6, d) * .6)
    probe = poly_mask([(470, 70), (476, 76), (360, 192), (354, 186)], .8); tip = ell_mask(357, 189, 4.5, 4.5, .8)
    pm = np.maximum(probe, tip); s.A = mix(s.A, np.broadcast_to(C(196, 202, 210), s.A.shape), pm); s.Hh += pm * 12; s.S = s.S * (1 - pm) + 1.3 * pm; s.N = np.where(pm > .5, 80, s.N)
    s.render("cav")
def fl_odeur():
    s = Scene(); cloth(s, seed=93); m, u, v = gauze(s, 300, 225, 175, 128, .05)
    d = blob(300, 226, 120, 130, irr=.24, ax=1.25, ay=.9); stain(s, m, sstep(.06, -.06, d) * .9, col=(150, 170, 80), tide=.55)
    stain(s, m, sstep(.06, -.06, blob(320, 232, 50, 140, irr=.3)) * .8, col=(120, 100, 60), tide=.4); s.render("odeur", vignette=.12)
def fl_peau():
    s = Scene(); s.skin(seed=34); d = blob(300, 226, 92, 111, irr=.16, ax=1.1, ay=.8)
    mac = np.exp(-np.clip(d, 0, None) / .9) * (d > -.02) * sstep(.25, .45, fbm(36, 3, 6) + .25)
    F1, F2 = worley(9, 7); wr = 1 - sstep(0, .1, F2 - F1); s.tint(mac, (238, 233, 224), .85)
    s.Hh += mac * (1.4 - wr * 1.2 + fbm(4, 2, 8) * .6); s.tint(mac * wr, (214, 204, 194), .35); s.S += mac * .3; s.N = np.where(mac > .4, 26, s.N)
    inside, bowl = s.crater(d, depth=8, wall=.3); s.granulation(inside, seed=20, cell=8); s.render("peau")

def ty_chir():
    s = Scene(); s.skin(seed=41, tone=(228, 182, 154))
    yline = 226 + 10 * np.sin((xx - 300) / 220 * 2.2); dist = np.abs(yy - yline); on = sstep(232, 210, np.abs(xx - 300))
    s.tint(np.exp(-(dist / 10) ** 2) * on, (206, 112, 104), .45); s.Hh -= np.exp(-(dist / 2.2) ** 2) * on * 2.5
    s.tint(np.exp(-(dist / 1.8) ** 2) * on, (110, 30, 26), .75); s.tint(on * np.exp(-(dist / 3) ** 2) * sstep(.75, .9, vnoise(6, 4)), (90, 24, 20), .6)
    for i, x in enumerate(range(112, 500, 42)):
        y = 226 + 10 * np.sin((x - 300) / 220 * 2.2); staple(s, x, y, w=17, rot=np.pi / 2 + .1 * np.cos(i * 1.7))
    s.render("chir")

def ty_trauma():
    s = Scene(); s.skin(seed=42); d = blob(300, 226, 150, 121, irr=.22, ax=1.35, ay=.62, rot=-.25)
    a = sstep(.04, -.08, d) * sstep(.25, .45, fbm(30, 3, 2) + .2)
    ang = -.25; v = (yy - 226) * np.cos(ang) - (xx - 300) * np.sin(ang); u = (xx - 300) * np.cos(ang) + (yy - 226) * np.sin(ang)
    st = sstep(.7, 1, np.abs(np.sin(v / 2.6 + fbm(25, 3, 3) * 5))) * sstep(.4, .6, vnoise(18, 6) + (np.sin(u / 23) * .2))
    s.tint(a, (214, 104, 92), .75); s.tint(a * st, (176, 52, 46), .4); s.Hh -= a * (1 + st * .45); s.S += a * .4; s.N = np.where(a > .5, 40, s.N)
    s.fluid(a * sstep(.86, .93, vnoise(2.6, 5)), (140, 12, 16), gloss=.9, height=.6, n=80)
    s.tint(a * sstep(.92, .97, vnoise(2.2, 9)), (70, 60, 46), .7)
    lac = blob(388, 194, 34, 9, irr=.1, ax=2.4, ay=.3, rot=.4); inside, bowl = s.crater(lac, depth=6, wall=.4, rim=.3); s.granulation(inside, seed=21, cell=5, dark=.25)
    s.render("trauma")

def ty_escarre():
    s = Scene(); cloth(s, col=(210, 214, 220), seed=95)
    L = ell_mask(170, 300, 200, 220, 3); R = ell_mask(430, 300, 200, 220, 3); bod = np.clip(L + R + poly_mask([(60, -10), (540, -10), (560, 180), (40, 180)], 8), 0, 1)
    s.skin(seed=43, m=bod); s.Hh += (gblur(L, 40) + gblur(R, 40)) * 46 + gblur(bod, 30) * 20
    cleft = np.exp(-((xx - 300) / 26) ** 2) * sstep(210, 320, yy); s.shade *= 1 - cleft * .32; s.shade *= 1 - np.exp(-((xx - 300) / 5) ** 2) * sstep(240, 330, yy) * .3
    d = blob(300, 150, 70, 131, irr=.18, ax=1.15, ay=.85); s.erythema(d, .9, .5, col=(176, 70, 72))
    inside, bowl = s.crater(d, depth=12, wall=.35); s.granulation(inside, seed=22, cell=7); s.slough(inside * sstep(.45, .6, fbm(26, 3, 9) - d * .3), seed=23)
    s.render("escarre", vignette=.1)

def ty_veineux():
    s = Scene(); cloth(s, col=(206, 210, 216), seed=96)
    leg = poly_mask([(170, -20), (430, -20), (420, 200), (412, 300), (440, 360), (600, 400), (600, 470), (120, 470), (150, 360), (180, 300), (182, 200)], 5)
    s.skin(seed=44, m=leg, tone=(220, 172, 142)); s.Hh += gblur(leg, 46) * 56; s.Hh += ell_mask(196, 352, 34, 28, 12) * 9
    zone = leg * sstep(150, 320, yy); hemo = zone * sstep(.25, .6, fbm(60, 3, 3)); s.tint(hemo, (122, 74, 46), .65)
    s.tint(zone * sstep(.9, .97, vnoise(5, 7)), (112, 62, 42), .3); s.S += zone * .12
    d = blob(258, 300, 84, 141, irr=.25, ax=1.35, ay=.62, rot=-.15); s.erythema(d, .45, .28)
    inside, bowl = s.crater(d, depth=5, wall=.3); s.granulation(inside, seed=24, cell=7); s.slough(inside * sstep(.42, .58, fbm(22, 3, 10)), seed=25)
    s.render("veineux", vignette=.1)

def ty_arteriel():
    s = Scene(); cloth(s, col=(206, 210, 216), seed=97)
    foot = poly_mask([(150, 470), (140, 330), (165, 230), (215, 180), (300, 168), (385, 176), (440, 215), (462, 320), (452, 470)], 8)
    toes = np.zeros((H, W), np.float32); nails = []
    for (x, y, rx, ry) in ((206, 150, 50, 66), (286, 132, 30, 44), (342, 136, 26, 38), (390, 152, 22, 32), (432, 180, 19, 27)):
        toes = np.maximum(toes, ell_mask(x, y, rx, ry, 3)); nails.append((x, y - ry * .45, rx * .55, ry * .38))
    fm = np.clip(foot + toes, 0, 1); s.skin(seed=45, m=fm, tone=(232, 200, 186)); s.Hh += gblur(fm, 30) * 44
    for (x, y, rx, ry) in nails:
        nm = ell_mask(x, y, rx * .85, ry * .85, 2); s.tint(nm, (226, 206, 196), .4); s.Hh += nm * 1.2; s.S += nm * .2; s.N = np.where(nm > .5, 40, s.N)
    s.tint(fm * sstep(.55, .75, fbm(70, 2, 4)), (226, 210, 214), .3); s.S += fm * .16; s.N = np.where(fm > .5, 32, s.N)
    d = blob(214, 214, 24, 151, irr=.06, ax=1, ay=.92); inside, bowl = s.crater(d, depth=13, wall=.5, rim=.35, rim_col=(150, 112, 116))
    s.necrosis(inside * sstep(-.15, -.45, d), seed=27, raise_=0); s.slough(inside * (1 - sstep(-.15, -.45, d)) * .7, seed=28, col=(218, 206, 176))
    s.render("arteriel", vignette=.1)

def ty_diab():
    s = Scene(); cloth(s, col=(206, 210, 216), seed=98)
    sole = poly_mask([(150, 470), (132, 330), (150, 220), (205, 165), (300, 148), (392, 156), (448, 200), (470, 310), (452, 470)], 8)
    toes = np.zeros((H, W), np.float32)
    for (x, y, rx, ry) in ((200, 142, 52, 62), (280, 118, 32, 42), (338, 120, 28, 37), (388, 136, 24, 32), (432, 166, 21, 28)): toes = np.maximum(toes, ell_mask(x, y, rx, ry, 3))
    fm = np.clip(sole + toes, 0, 1); s.skin(seed=46, m=fm, tone=(234, 196, 176)); s.Hh += gblur(fm, 30) * 44
    s.tint(fm * sstep(.5, .8, fbm(60, 3, 9)), (226, 200, 160), .3)
    d = blob(214, 240, 30, 161, irr=.07); cal = np.exp(-np.clip(d, 0, None) / 1.1) * (d > -.03) * fm
    s.tint(cal, (220, 196, 138), .7); s.Hh += cal * 5 + cal * (fbm(5, 2, 4) - .5) * 1.6; s.S += cal * .1
    inside, bowl = s.crater(d, depth=14, wall=.5, rim=.2, rim_col=(214, 188, 146)); s.granulation(inside, seed=29, cell=6, dull=.3)
    s.render("diab", vignette=.1)

def ty_brulure():
    s = Scene(); s.skin(seed=47); d = blob(300, 230, 170, 171, irr=.2, ax=1.25, ay=.8)
    e = s.erythema(d, .5, .5, col=(214, 82, 70)); s.tint(sstep(.05, -.1, d), (222, 96, 84), .5)
    b = blob(296, 214, 86, 173, irr=.1, ax=1.25, ay=.85); bm = sstep(.03, -.04, b); dome = sstep(.02, -.6, b)
    s.A = mix(s.A, mix(s.A, np.broadcast_to(C(244, 226, 200), s.A.shape), .55), bm); s.Hh += dome * 22; s.S += bm * 1.1; s.N = np.where(bm > .5, 90, s.N)
    s.tint(np.exp(-((b + .02) / .03) ** 2), (236, 210, 190), .6)
    rup = blob(170, 268, 34, 175, irr=.2, ax=1.3, ay=.8); rm = sstep(.03, -.03, rup) * (1 - bm)
    s.tint(rm, (232, 124, 116), .8); s.S += rm * .7; s.N = np.where(rm > .5, 60, s.N)
    s.tint(np.exp(-((rup) / .05) ** 2) * (1 - bm), (240, 224, 214), .7); s.render("brulure")
def ty_tumorale():
    s = Scene(); s.skin(seed=48); d = blob(300, 226, 140, 181, irr=.22, ax=1.1, ay=.82)
    s.erythema(d, .45, .4, col=(170, 70, 80)); inside = sstep(.03, -.03, d)
    F1, _ = worley(34, 7); lob = np.clip(1 - F1 * 1.1, 0, 1) ** .8; s.Hh += inside * (lob * 16 + sstep(.0, -.3, d) * 14)
    s.granulation(inside, seed=30, cell=6); s.tint(inside * sstep(.5, .8, fbm(40, 3, 11)), (120, 60, 90), .45)
    s.slough(inside * sstep(.62, .75, fbm(30, 3, 12)), seed=31); s.necrosis(inside * sstep(.8, .88, fbm(28, 2, 13)), seed=32, raise_=10)
    s.fluid(inside * sstep(.86, .92, vnoise(5, 14)), (150, 10, 14), gloss=1., height=1, n=90); s.render("tumorale")

ALL = {"noir": bed_noir, "jaune": bed_jaune, "rouge": bed_rouge, "rose": bed_rose, "sec": exu_sec, "faible": exu_faible, "modere": exu_modere, "abondant": exu_abondant,
       "inf": fl_inf, "sang": fl_sang, "cav": fl_cav, "odeur": fl_odeur, "peau": fl_peau, "chir": ty_chir, "trauma": ty_trauma, "escarre": ty_escarre,
       "veineux": ty_veineux, "arteriel": ty_arteriel, "diab": ty_diab, "brulure": ty_brulure, "tumorale": ty_tumorale}
if __name__ == "__main__":
    keys = sys.argv[1:] or list(ALL)
    for k in keys: ALL[k](); print("ok", k)
