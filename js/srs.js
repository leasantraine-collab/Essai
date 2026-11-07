/* Carnet IFSI — cartes de révision à répétition espacée.
   Les cartes sont créées automatiquement à partir des contenus : questions de vérification et tableaux des cours,
   phrases essentielles à compléter (les mots en gras deviennent des trous), définitions, signes, complications,
   traitements et rôle infirmier des pathologies, indications, matériel, surveillance et erreurs des soins,
   mécanisme, indications, effets indésirables et surveillance des médicaments.
   Chaque réponse (À revoir, Difficile, Bien, Facile) espace la prochaine révision (algorithme de type SM-2).
   Chargé après qualite.js, avant app.js. */
const SRS_IC={cards:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="14" height="14" rx="2.5"/><path d="M7 3h11.5A2.5 2.5 0 0 1 21 5.5V17"/><path d="M7 11h6M7 15h4"/></svg>',
 fire:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-4 0-7-2.8-7-6.6 0-3.1 2-5 3.6-6.6.4 1.6 1.3 2.7 2.4 3.2C11 7.6 12.7 5 15 3c.2 3 1.4 4.6 2.6 6.2 1 1.4 1.4 2.7 1.4 4.6C19 18 16 21 12 21z"/></svg>'};
const SRS_DEF={decks:[],news:15};
const srsSet=()=>Object.assign({},SRS_DEF,store.get("srsSet",{}));
const srsSt=()=>store.get("srs",{});
const srsDayN=(d)=>{const x=d?new Date(d):new Date();return Math.floor((x.getTime()-x.getTimezoneOffset()*6e4)/864e5);};
const srsH=t=>{let h=0;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;return (h>>>0).toString(36);};

/* ---------- Création des cartes ---------- */
let SRS_CARDS=null,SRS_BY=null;
const srsList=(a,n)=>(Array.isArray(a)?a:[a]).filter(Boolean).slice(0,n||6);
const srsBold=t=>/\*\*(.+?)\*\*/.test(t);
function srsCards(){
 if(SRS_CARDS)return SRS_CARDS;const out=[];
 const add=(key,tag,type,q,a,ctx)=>{if(!q||!a||(Array.isArray(a)&&!a.length))return;out.push({id:key+"#"+tag,key,type,q,a,ctx});};
 const cloze=(key,txt,ctx)=>{if(!txt||!srsBold(txt))return;const bold=(txt.match(/\*\*(.+?)\*\*/g)||[]).join("").length;if(bold>txt.length*.6)return;add(key,"z"+srsH(txt),"cloze",txt,txt,ctx);};
 /* Pathologies */
 (typeof PATHOS!=="undefined"?PATHOS:[]).forEach(p=>{const k="p:"+p.i,c=p.n;
  add(k,"d","qa",`Qu'est-ce que : ${p.n} ?`,p.d,c);
  add(k,"sg","qa",`Quels sont les signes de : ${p.n} ?`,srsList(p.sg),c);
  add(k,"al","qa",`Quels signes d'alerte surveiller : ${p.n} ?`,srsList(p.al),c);
  add(k,"co","qa",`Quelles sont les complications : ${p.n} ?`,srsList(p.co),c);
  add(k,"tt","qa",`Quels traitements : ${p.n} ?`,srsList(p.tt,5),c);
  add(k,"ri","qa",`Quel rôle infirmier : ${p.n} ?`,srsList(p.ri),c);});
 /* Soins */
 (typeof SOINS!=="undefined"?SOINS:[]).forEach(s=>{const k="s:"+s.i,c=s.n;
  add(k,"d","qa",`En quoi consiste le soin : ${s.n} ?`,srsList(s.d,1)[0],c);
  add(k,"ind","qa",`Indications : ${s.n} ?`,srsList(s.ind,5),c);
  add(k,"ci","qa",`Contre-indications et précautions : ${s.n} ?`,srsList(s.ci,5),c);
  add(k,"mat","qa",`Quel matériel préparer : ${s.n} ?`,srsList(s.mat,10),c);
  add(k,"surv","qa",`Que surveiller : ${s.n} ?`,srsList(s.surv,5),c);
  add(k,"err","qa",`Quelles erreurs éviter : ${s.n} ?`,srsList(s.err,4),c);});
 /* Médicaments */
 (typeof MEDS!=="undefined"?MEDS:[]).forEach(m=>{const k="m:"+m.i,c=m.n;
  add(k,"d","qa",`Que sont les ${m.n.charAt(0).toLowerCase()+m.n.slice(1)} ?`,srsList(m.d,1)[0],c);
  add(k,"ma","qa",`Mécanisme d'action : ${m.n} ?`,srsList(m.ma,1)[0],c);
  add(k,"dci","qa",`Principaux médicaments : ${m.n} ?`,(m.m||[]).slice(0,6).map(x=>`**${x.dci}**${x.br?` (${x.br})`:""}`),c);
  add(k,"ind","qa",`Indications : ${m.n} ?`,srsList(m.ind,5),c);
  add(k,"ci","qa",`Contre-indications : ${m.n} ?`,srsList(m.ci,5),c);
  add(k,"ef","qa",`Effets indésirables : ${m.n} ?`,srsList(m.ef,6),c);
  add(k,"sv","qa",`Surveillance infirmière : ${m.n} ?`,[...srsList(m.sc,4),...srsList(m.sb,2)],c);
  add(k,"err","qa",`Quelles erreurs éviter : ${m.n} ?`,srsList(m.err,4),c);});
 /* Cours */
 COURS.filter(c=>c.chap&&!c.pro).forEach(c=>{const k="c:"+c.id;
  c.chap.forEach(ch=>(ch.b||[]).forEach(b=>{
   if(b.t==="verif")(b.items||[]).forEach(([q,a])=>add(k,"v"+srsH(q),"qa",q,a,c.titre));
   else if(b.t==="table")(b.rows||[]).slice(0,8).forEach(([x,y])=>{if(x&&y&&String(x).length<80)add(k,"t"+srsH(x+y),"qa",`${ch.h} · ${String(x).replace(/\*\*/g,"")} ?`,y,c.titre);});
   else if(b.t==="valeurs")(b.rows||[]).forEach(r=>add(k,"n"+srsH(r[0]),"qa",`Valeur normale : ${r[0]}${r[1]?` (${r[1]})`:""} ?`,r[2],c.titre));
   else if(b.t==="signes"&&b.e)add(k,"g"+srsH(b.e),"qa",`${b.e} : quels signes ?`,srsList(b.items,8),c.titre);
   else if(b.t==="retenir")cloze(k,b.txt,c.titre);}));
  c.ess.forEach(e=>cloze(k,e,c.titre));});
 /* Fiches */
 FICHES.filter(f=>f.pages).forEach(f=>{const k="f:"+f.id;
  f.pages.flat().forEach(b=>{
   if(b.t==="def"&&b.txt)add(k,"d"+srsH(b.h||""),"qa",/^définition/i.test(b.h||"")?`Définir : ${f.titre} ?`:`${f.titre} · ${b.h} ?`,b.txt,f.titre);
   else if(b.t==="valeurs")(b.rows||[]).forEach(r=>add(k,"n"+srsH(r[0]+r[1]),"qa",`${f.titre} · ${r[0]}${r[1]?" "+r[1]:""} ?`,r[2],f.titre));
   else if(b.t==="signes")add(k,"g"+srsH(b.h||""),"qa",`${f.titre} · ${b.h} ?`,srsList(b.items,8),f.titre);
   else if(b.t==="retenir")cloze(k,b.txt,f.titre);});});
 const seen=new Set();SRS_CARDS=out.filter(c=>!seen.has(c.id)&&seen.add(c.id));
 SRS_BY={};SRS_CARDS.forEach(c=>{(SRS_BY[c.key]=SRS_BY[c.key]||[]).push(c);});
 return SRS_CARDS;
}
const srsOfKey=k=>{srsCards();return SRS_BY[k]||[];};

/* ---------- Paquets ---------- */
function srsKeyMeta(key){const [k,id]=key.split(/:(.*)/s);
 if(k==="p"){const p=typeof PATHOS!=="undefined"&&PATHOS.find(x=>x.i===id);return p?{fam:"p:"+p.s,ue:typeof UE_SP!=="undefined"?UE_SP[p.s]:null}:{};}
 if(k==="s"){const s=typeof SOINS!=="undefined"&&SOINS.find(x=>x.i===id);return s?{fam:"s:"+s.s,ue:typeof UE_SO!=="undefined"?UE_SO[s.s]:null}:{};}
 if(k==="m"){const m=typeof MEDS!=="undefined"&&MEDS.find(x=>x.i===id);return m?{fam:"m:"+m.s,ue:typeof UE_MD!=="undefined"?UE_MD[m.s]:null}:{};}
 const o=k==="c"?COURS.find(x=>x.id===id):FICHES.find(x=>x.id===id);return o?{fam:k+":"+o.cat,ue:o.ue}:{};}
let SRS_META=null;
const srsMeta=k=>{if(!SRS_META)SRS_META={};return SRS_META[k]||(SRS_META[k]=srsKeyMeta(k));};
function srsStudiedKeys(){const s=new Set();
 const add=(p,l)=>{try{(l||[]).forEach(id=>s.add(p+":"+id));}catch(e){}};
 add("f",typeof reviewed==="function"?reviewed():[]);add("c",typeof studied==="function"?studied():[]);
 add("p",typeof pxDone==="function"?pxDone():[]);add("s",typeof soDone==="function"?soDone():[]);add("m",typeof mdDone==="function"?mdDone():[]);return s;}
/* Un paquet : "etudies", "favoris", "ue:<code>" (référentiel courant), "fam:<p|s|m|c|f>:<section>". */
function srsInDeck(card,deck){
 if(deck==="etudies")return srsStudiedKeys().has(card.key);
 if(deck==="favoris")return favs().includes(card.key);
 if(deck.startsWith("ue:")){const m=srsMeta(card.key);return !!(m.ue&&(m.ue[state.ueRef]||[]).includes(deck.slice(3)));}
 if(deck.startsWith("fam:"))return srsMeta(card.key).fam===deck.slice(4);
 return false;}
function srsDeckCards(deck){
 const C=srsCards();
 if(deck==="etudies"){const s=srsStudiedKeys();return C.filter(c=>s.has(c.key));}
 if(deck==="favoris"){const f=new Set(favs());return C.filter(c=>f.has(c.key));}
 return C.filter(c=>srsInDeck(c,deck));}
function srsDeckLabel(deck){
 if(deck==="etudies")return "Ce que j'ai étudié";if(deck==="favoris")return "Mes favoris";
 if(deck.startsWith("ue:")){const u=(UE[state.ueRef]||UE["2026"]).list.find(x=>x[0]===deck.slice(3));return u?`UE ${u[0]} · ${u[1]}`:deck;}
 const [,k,s]=deck.split(":");
 if(k==="p"){const x=SPES.find(y=>y[0]===s);return x?x[1]:s;}if(k==="s"){const x=SO_SECS.find(y=>y[0]===s);return x?x[1]:s;}
 if(k==="m"){const x=MD_SECS.find(y=>y[0]===s);return x?x[1]:s;}const c=CATS.find(y=>y.id===s);return c?c.nom:s;}
function srsSelCards(){const D=srsSet().decks;if(!D.length)return [];const ids=new Set(),out=[];
 D.forEach(d=>srsDeckCards(d).forEach(c=>{if(!ids.has(c.id)){ids.add(c.id);out.push(c);}}));return out;}

/* ---------- Planification (type SM-2) ---------- */
/* État d'une carte : [jour d'échéance, intervalle en jours, facilité ×100, répétitions réussies, oublis, dernier jour] */
function srsNext(s,g,today){
 let [due,iv,ef,reps,lap]=s||[today,0,250,0,0];ef=ef/100;
 if(g===0){lap++;reps=0;iv=0;ef=Math.max(1.3,ef-.2);due=today;}
 else{if(reps===0)iv=g===1?1:g===2?1:4;else if(reps===1)iv=g===1?2:g===2?3:6;
  else iv=g===1?Math.max(iv+1,Math.round(iv*1.2)):g===2?Math.max(iv+1,Math.round(iv*ef)):Math.max(iv+2,Math.round(iv*ef*1.3));
  iv=Math.min(iv,365);if(g===1)ef=Math.max(1.3,ef-.15);if(g===3)ef=ef+.15;reps++;due=today+iv;}
 return [due,iv,Math.round(ef*100),reps,lap,today];}
const srsIvTxt=d=>d<=0?"< 10 min":d===1?"1 j":d<30?`${d} j`:d<365?`${Math.round(d/30)} mois`:"1 an";
const srsIsNew=(st,c)=>!st[c.id];
const srsDue=(st,c,today)=>st[c.id]&&st[c.id][0]<=today;
function srsDayCount(){const d=store.get("srsDay",{}),t=srsDayN();return d.d===t?d:{d:t,n:0,r:0};}
function srsCounts(cards,st,today){st=st||srsSt();today=today==null?srsDayN():today;let due=0,nw=0,mature=0,learn=0;
 cards.forEach(c=>{const s=st[c.id];if(!s)nw++;else{if(s[0]<=today)due++;if(s[1]>=21)mature++;else learn++;}});return {due,nw,mature,learn,tot:cards.length};}
function srsStreak(){const L=store.get("srsLog",{}),t=srsDayN();let n=0,d=L[t]?t:t-1;while(L[d]){n++;d--;}return n;}

/* ---------- Séance ---------- */
function srsBuild(cards,opt){
 opt=opt||{};const st=srsSt(),t=srsDayN(),dc=srsDayCount(),S=srsSet();
 const due=cards.filter(c=>srsDue(st,c,t)).sort(()=>Math.random()-.5);
 const lim=opt.all?1e9:Math.max(0,S.news-dc.n);let nw=cards.filter(c=>srsIsNew(st,c)).slice(0,lim);
 if(!due.length&&!nw.length&&opt.cram)return cards.slice().sort(()=>Math.random()-.5).slice(0,30).map(c=>c.id);
 const q=[];let i=0;due.forEach((c,k)=>{q.push(c.id);if((k+1)%3===0&&i<nw.length)q.push(nw[i++].id);});while(i<nw.length)q.push(nw[i++].id);
 return q;}
function srsStart(cards,label,opt){const q=srsBuild(cards,opt);
 if(!q.length){toast("Rien à réviser pour l'instant : revenez demain");return false;}
 state.srs={q,i:0,show:false,label,ok:0,ko:0,seen:0,start:Date.now(),back:location.hash};state.train="cartes";
 if(location.hash!=="#entrainer/cartes")location.hash="entrainer/cartes";else render(true);return true;}
function srsRate(g){
 const z=state.srs;if(!z||!z.show)return;const id=z.q[z.i],st=srsSt(),t=srsDayN(),was=st[id],c=srsCards().find(x=>x.id===id);
 st[id]=srsNext(was,g,t);store.set("srs",st);
 const dc=srsDayCount();if(!was)dc.n++;else dc.r++;store.set("srsDay",dc);
 const Lg=store.get("srsLog",{});const e=Lg[t]||[0,0];e[0]++;if(g>0)e[1]++;Lg[t]=e;Object.keys(Lg).forEach(k=>{if(+k<t-180)delete Lg[k];});store.set("srsLog",Lg);
 if(typeof exRecord==="function"&&c)exRecord("card",c.key,g>0,srsMeta(c.key).ue);
 z.seen++;if(g>0)z.ok++;else{z.ko++;const pos=Math.min(z.q.length,z.i+4);z.q.splice(pos,0,id);}
 z.i++;z.show=false;haptic(g===0?"MEDIUM":"LIGHT");render();}
const srsMd=t=>md(String(t||""));
function srsFace(c,back){
 if(c.type==="cloze"){const h=back?srsMd(c.q).replace(/<b>/g,'<b class="srs-fill">'):esc(c.q).replace(/\*\*(.+?)\*\*/g,(m,x)=>`<span class="srs-blank" aria-label="mot à trouver">${"_".repeat(Math.min(14,Math.max(4,x.length)))}</span>`).replace(/==(.+?)==/g,"$1");
  return `<p class="srs-cloze">${h}</p>`;}
 if(!back)return `<h2 class="srs-q">${srsMd(c.q)}</h2>`;
 return Array.isArray(c.a)?`<ul class="srs-ul">${c.a.map(x=>`<li>${srsMd(x)}</li>`).join("")}</ul>`:`<p class="srs-a">${srsMd(c.a)}</p>`;}
const SRS_ROUTE={f:"fiche",c:"cours",p:"patho",s:"soin",m:"med"};
function vSrsRun(){
 const z=state.srs;
 if(z.i>=z.q.length){const pct=z.seen?Math.round(z.ok/z.seen*100):0,min=Math.max(1,Math.round((Date.now()-z.start)/6e4));
  return `<div class="stack-lg"><div class="q-top"><span class="eyebrow">${esc(z.label||"Cartes")}</span><button class="q-close" data-act="srs-quit">Fermer</button></div>
   <div class="score-hero">${ring(pct,140)}<h1>Séance terminée</h1><p class="lead">${plural(z.seen,"réponse")} en ${plural(min,"minute")} · ${z.ok} réussie${z.ok>1?"s":""}. ${srsStreak()>1?`Série en cours : ${srsStreak()} jours d'affilée.`:"Revenez demain : les cartes reviennent au bon moment."}</p></div>
   <div class="btn-row"><button class="btn" data-act="srs-quit">Terminer</button>${srsCounts(srsSelCards()).due?`<button class="btn ghost" data-act="srs-go">Encore des cartes dues</button>`:""}</div></div>`;}
 const id=z.q[z.i],c=srsCards().find(x=>x.id===id);if(!c){z.i++;return vSrsRun();}
 const st=srsSt(),s=st[id],t=srsDayN(),[k,cid]=c.key.split(/:(.*)/s);
 const btn=(g,l,cls)=>`<button class="srs-b ${cls}" data-act="srs-rate" data-k="${g}"><b>${l}</b><small>${srsIvTxt(srsNext(s,g,t)[1]*(g===0?0:1))}</small></button>`;
 return `<div class="stack-lg srs-run"><div class="stack-sm"><div class="q-top"><span class="eyebrow">${esc(z.label||"Cartes")} · ${z.i+1} sur ${z.q.length}</span><button class="q-close" data-act="srs-quit">Quitter</button></div>
  <div class="progress"><i style="width:${z.i/z.q.length*100}%"></i></div></div>
  <div class="srs-card${z.show?" back":""}"><span class="srs-ctx">${s?"Révision":"Nouvelle carte"} · ${esc(c.ctx||"")}</span>${srsFace(c,false)}
   ${z.show?`<div class="srs-ans">${c.type==="cloze"?srsFace(c,true):srsFace(c,true)}</div><a class="link srs-src" href="#${SRS_ROUTE[k]}/${encodeURIComponent(cid)}">Ouvrir le contenu</a>`:""}</div>
  ${z.show?`<div class="srs-bs" role="group" aria-label="Comment avez-vous répondu ?">${btn(0,"À revoir","r0")}${btn(1,"Difficile","r1")}${btn(2,"Bien","r2")}${btn(3,"Facile","r3")}</div>
   <p class="ot-hint srs-hint">Soyez honnête : « À revoir » fait revenir la carte dans quelques minutes, « Facile » l'éloigne davantage.</p>`
  :`<button class="btn block srs-show" data-act="srs-show">Afficher la réponse</button><p class="ot-hint srs-hint">Répondez dans votre tête (ou à voix haute), puis vérifiez.</p>`}</div>`;
}
/* ---------- Accueil des cartes ---------- */
function srsDeckGroups(){const C=srsCards(),fam={};
 C.forEach(c=>{const f=srsMeta(c.key).fam;if(f)(fam[f]=fam[f]||[]).push(c);});
 const grp=(pre,lab,order)=>[lab,order.map(s=>"fam:"+pre+":"+s).filter(d=>fam[d.slice(4)])];
 const ueL=(UE[state.ueRef]||UE["2026"]).list;
 return [grp("p","Pathologies par spécialité",SPES.map(x=>x[0])),grp("s","Soins par thème",SO_SECS.map(x=>x[0])),grp("m","Médicaments par classe",MD_SECS.map(x=>x[0])),
  grp("c","Cours par catégorie",CATS.map(x=>x.id)),grp("f","Fiches par catégorie",CATS.map(x=>x.id)),["Par UE ("+(UE[state.ueRef]||UE["2026"]).sub+")",ueL.map(u=>"ue:"+u[0])]];}
function vSrsHome(){
 const S=srsSet(),sel=srsSelCards(),st=srsSt(),cn=srsCounts(sel,st),dc=srsDayCount(),nwToday=Math.min(cn.nw,Math.max(0,S.news-dc.n)),streak=srsStreak();
 const all=srsCards(),known=all.filter(c=>st[c.id]).length,L=store.get("srsLog",{}),t=srsDayN();
 let r30=[0,0];Object.entries(L).forEach(([d,v])=>{if(+d>t-30){r30[0]+=v[0];r30[1]+=v[1];}});
 const sem=state.sem||1,semUE=(UE[state.ueRef]||UE["2026"]).list.filter(u=>u[3].includes(sem)).map(u=>"ue:"+u[0]);
 const chip=(d,n)=>{const on=S.decks.includes(d);return `<button class="chip srs-deck" data-act="srs-deck" data-k="${esc(d)}" aria-pressed="${on}">${esc(srsDeckLabel(d))}<span>${n}</span></button>`;};
 const groups=srsDeckGroups().map(([lab,decks])=>{const items=decks.map(d=>[d,srsDeckCards(d).length]).filter(x=>x[1]);if(!items.length)return "";const on=items.filter(([d])=>S.decks.includes(d)).length;
  return `<details class="ot-det srs-grp"${on?" open":""}><summary>${esc(lab)}${on?` <span class="tag">${on} choisi${on>1?"s":""}</span>`:""}</summary><div class="chips wrapchips">${items.map(([d,n])=>chip(d,n)).join("")}</div></details>`;}).join("");
 const nSt=srsDeckCards("etudies").length,nFav=srsDeckCards("favoris").length;
 const days=[...Array(14)].map((_,i)=>{const d=t-13+i,v=L[d];return `<i class="${v?v[0]>=30?"h3":v[0]>=10?"h2":"h1":""}" title="${v?v[0]:0}"></i>`;}).join("");
 return `<div class="stack-lg">
  <section class="srs-today"><div class="srs-t-top"><span class="nt-ic">${SRS_IC.cards}</span><div><span class="eyebrow">Aujourd'hui</span><h2>${S.decks.length?(cn.due+nwToday?`${plural(cn.due+nwToday,"carte")} à réviser`:"Tout est à jour"):"Choisissez vos paquets"}</h2>
   <small>${S.decks.length?`${cn.due} à revoir · ${nwToday} nouvelle${nwToday>1?"s":""} (sur ${S.news} par jour)`:"Les cartes sont créées automatiquement à partir des contenus. Commencez par ce que vous avez déjà étudié."}</small></div></div>
   ${S.decks.length?`<button class="btn block" data-act="srs-go" ${cn.due+nwToday?"":"disabled"}>${IC.play}Commencer la révision</button>`:`<button class="btn block" data-act="srs-quick" ${nSt?"":"disabled"}>${IC.play}${nSt?`Réviser ce que j'ai étudié · ${plural(nSt,"carte")}`:"Étudiez d'abord une fiche ou un cours"}</button>`}
   <div class="srs-kpi"><span><b>${streak}</b>jour${streak>1?"s":""} d'affilée</span><span><b>${known}</b>carte${known>1?"s":""} apprise${known>1?"s":""}</span><span><b>${r30[0]?Math.round(r30[1]/r30[0]*100)+" %":"–"}</b>réussite sur 30 j</span></div>
   <div class="srs-heat" aria-label="Activité des 14 derniers jours">${days}</div></section>
  <section class="stack-sm"><div class="section-title"><h2>Mes paquets</h2><span class="muted">${S.decks.length?plural(sel.length,"carte"):""}</span></div>
   <p class="muted">Touchez un paquet pour l'ajouter à vos révisions quotidiennes. ${all.length.toLocaleString("fr-FR")} cartes disponibles.</p>
   <div class="chips wrapchips">${nSt?chip("etudies",nSt):""}${nFav?chip("favoris",nFav):""}${semUE.map(d=>[d,srsDeckCards(d).length]).filter(x=>x[1]).map(([d,n])=>chip(d,n)).join("")}</div>
   ${groups}
   ${S.decks.length?`<button class="link" data-act="srs-clear">Vider ma sélection</button>`:""}</section>
  <section class="stack-sm"><h2>Réglages</h2><div class="list nt-list"><label class="nt-row" for="srs-news"><span><b>Nouvelles cartes par jour</b><small>15 à 20 suffisent : les révisions s'ajoutent ensuite chaque jour.</small></span><select id="srs-news" data-srs="news">${[5,10,15,20,30,50].map(n=>`<option ${S.news===n?"selected":""}>${n}</option>`).join("")}</select></label></div></section>
  <p class="disclaimer">La répétition espacée : chaque carte revient juste avant que vous l'oubliiez. Quelques minutes par jour suffisent à retenir durablement.</p></div>`;
}
/* Bouton en bas d'un contenu */
function srsCta(it){const L=srsOfKey(it.key);if(!L.length)return "";const c=srsCounts(L);
 return `<button class="a4-cta srs-cta" data-act="srs-content" data-k="${esc(it.key)}"><span class="a4-cta-ic">${SRS_IC.cards}</span><span><b>Réviser en cartes · ${plural(L.length,"carte")}</b><small>${c.nw===L.length?"Testez-vous sur ce contenu, puis il revient au bon moment":`${c.due} à revoir · ${c.nw} nouvelle${c.nw>1?"s":""} · ${c.mature} bien acquise${c.mature>1?"s":""}`}</small></span>${IC.play}</button>`;}
function srsAct(b,a){const k=b.dataset.k;
 if(a==="srs-go")srsStart(srsSelCards(),"Révision du jour");
 else if(a==="srs-quick"){const S=srsSet();S.decks=["etudies"];store.set("srsSet",S);srsStart(srsSelCards(),"Révision du jour");}
 else if(a==="srs-content"){const it=ctItem(...k.split(/:(.*)/s).slice(0,2));srsStart(srsOfKey(k),it?it.titre:"Cartes",{all:true,cram:true});}
 else if(a==="srs-show"){if(state.srs){state.srs.show=true;render();}}
 else if(a==="srs-rate")srsRate(+k);
 else if(a==="srs-quit"){const back=state.srs&&state.srs.back;state.srs=null;if(back&&back!=="#entrainer/cartes")location.hash=back.slice(1);else render(true);}
 else if(a==="srs-deck"){const S=srsSet();S.decks=S.decks.includes(k)?S.decks.filter(x=>x!==k):[...S.decks,k];store.set("srsSet",S);haptic();const y=window.scrollY;render();window.scrollTo(0,y);}
 else if(a==="srs-clear"){const S=srsSet();S.decks=[];store.set("srsSet",S);render();}
}
function srsInput(t){if(t.dataset.srs==="news"){const S=srsSet();S.news=+t.value||15;store.set("srsSet",S);render();}}
document.addEventListener("keydown",e=>{if(!state.srs||route().v!=="entrainer"||state.train!=="cartes"||e.target.matches("input,textarea,select"))return;
 if(!state.srs.show&&(e.key===" "||e.key==="Enter")){e.preventDefault();state.srs.show=true;render();}
 else if(state.srs.show&&["1","2","3","4"].includes(e.key)){e.preventDefault();srsRate(+e.key-1);}});
