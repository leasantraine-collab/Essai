/* Carnet IFSI — « Ma vidéo de référence » : pour chaque fiche de soin, l'étudiant colle le lien d'une vraie vidéo
   recommandée par son IFSI ou son formateur (YouTube, Vimeo, Dailymotion, fichier vidéo, ou toute page web).
   Les liens sont enregistrés sur l'appareil (et dans la sauvegarde). La vidéo ne se charge qu'au toucher.
   Chargé après videos-lib.js, avant app.js. */
const RV_MAX=5;
const rvAll=()=>store.get("refvid",{});
const rvOf=id=>(rvAll()[id]||[]).filter(x=>x&&x.u);
const rvSave=(id,list)=>{const a=rvAll();if(list.length)a[id]=list;else delete a[id];store.set("refvid",a);};
const rvCount=()=>Object.values(rvAll()).reduce((n,l)=>n+(Array.isArray(l)?l.length:0),0);
/* Analyse d'un lien : plateforme, identifiant, adresse d'intégration. */
function rvParse(raw){
 let s=String(raw||"").trim();if(!s)return null;if(!/^https?:\/\//i.test(s))s="https://"+s;
 let u;try{u=new URL(s);}catch(e){return null;}
 if(!/^https?:$/.test(u.protocol)||!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(u.hostname))return null;
 const h=u.hostname.replace(/^(www|m|music)\./,""),seg=u.pathname.split("/").filter(Boolean),okId=x=>x&&/^[A-Za-z0-9_-]{4,64}$/.test(x)?x:null;
 const tsec=v=>{if(!v)return 0;const m=String(v).match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);return m?(+m[1]||0)*3600+(+m[2]||0)*60+(+m[3]||0):0;};
 if(h==="youtube.com"||h==="youtube-nocookie.com"||h==="youtu.be"){
  const id=okId(h==="youtu.be"?seg[0]:u.searchParams.get("v")||(["embed","shorts","live","v"].includes(seg[0])?seg[1]:null));
  if(!id)return {kind:"link",url:u.href,host:h};const st=tsec(u.searchParams.get("t")||u.searchParams.get("start"));
  return {kind:"youtube",id,url:`https://www.youtube.com/watch?v=${id}${st?`&t=${st}s`:""}`,embed:`https://www.youtube-nocookie.com/embed/${id}?rel=0${st?`&start=${st}`:""}`,host:"YouTube"};}
 if(h==="vimeo.com"||h==="player.vimeo.com"){const id=seg.find(x=>/^\d{5,12}$/.test(x));if(!id)return {kind:"link",url:u.href,host:h};
  return {kind:"vimeo",id,url:`https://vimeo.com/${id}`,embed:`https://player.vimeo.com/video/${id}?dnt=1`,host:"Vimeo"};}
 if(h==="dailymotion.com"||h==="dai.ly"){const id=okId(h==="dai.ly"?seg[0]:seg[0]==="video"?String(seg[1]||"").split("_")[0]:seg[0]==="embed"?seg[2]:null);
  if(!id)return {kind:"link",url:u.href,host:h};return {kind:"dailymotion",id,url:`https://www.dailymotion.com/video/${id}`,embed:`https://www.dailymotion.com/embed/video/${id}`,host:"Dailymotion"};}
 if(/\.(mp4|webm|ogv|ogg|mov|m4v)$/i.test(u.pathname))return {kind:"file",url:u.href,host:h};
 return {kind:"link",url:u.href,host:h};
}
const RV_IC={film:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9.5v5l4.5-2.5z"/></svg>',
 play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',ext:'<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
 link:'<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'};
function rvItem(id,v,i){const P=rvParse(v.u);if(!P)return "";const ttl=v.t||`Vidéo de référence · ${P.host}`,live=state.rvPlay===id+"/"+i;
 let media;
 if(P.kind==="link")media=`<a class="rv-link" href="${esc(P.url)}" target="_blank" rel="noopener noreferrer">${RV_IC.link}<span><b>Ouvrir la vidéo</b><small>${esc(P.host)} · s'ouvre dans le navigateur</small></span>${RV_IC.ext}</a>`;
 else if(live&&P.kind==="file")media=`<div class="rv-frame"><video src="${esc(P.url)}" controls playsinline preload="metadata"></video></div>`;
 else if(live)media=`<div class="rv-frame"><iframe src="${esc(P.embed)}" title="${esc(ttl)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
 else media=`<button class="rv-poster" data-act="rv-play" data-k="${esc(id)}" data-i="${i}" aria-label="Lire : ${esc(ttl)}"><span class="rv-pi">${RV_IC.play}</span><span class="rv-pt">${esc(P.host)}</span><small>Touchez pour charger la vidéo (connexion nécessaire)</small></button>`;
 return `<div class="rv-item">${media}<div class="rv-meta"><span><b>${esc(ttl)}</b>${v.s?`<small>Source : ${esc(v.s)}</small>`:""}</span>
  <span class="rv-acts">${P.kind!=="link"?`<a class="rv-b" href="${esc(P.url)}" target="_blank" rel="noopener noreferrer" aria-label="Ouvrir sur ${esc(P.host)}">${RV_IC.ext}</a>`:""}<button class="rv-b rv-del" data-act="rv-del" data-k="${esc(id)}" data-i="${i}" aria-label="Retirer cette vidéo">${IC.x}</button></span></div></div>`;}
/* Bloc affiché dans chaque fiche de soin. */
function rvBlock(id){const L=rvOf(id),open=state.rvForm===id;
 const form=`<form class="rv-form cd-form" id="rv-form" data-k="${esc(id)}" autocomplete="off">
  <label for="rv-u">Lien de la vidéo<input id="rv-u" type="url" inputmode="url" required placeholder="https://www.youtube.com/watch?v=…" maxlength="500"></label>
  <label for="rv-t">Titre (facultatif)<input id="rv-t" maxlength="80" placeholder="Ex. Pose de VVP, CHU de Lyon"></label>
  <label for="rv-s">Recommandée par (facultatif)<input id="rv-s" maxlength="60" placeholder="Ex. formatrice de l'UE 4.4, tutrice de stage"></label>
  <div class="btn-row"><button class="btn" type="submit">${IC.plus}Ajouter</button><button class="link" type="button" data-act="rv-cancel">Annuler</button></div>
  <small class="ot-hint">YouTube, Vimeo, Dailymotion ou lien vers un fichier vidéo s'affichent dans la fiche ; les autres liens (plateforme de l'IFSI…) s'ouvrent dans le navigateur. Choisissez des vidéos recommandées par votre IFSI.</small></form>`;
 return `<section class="rv" id="rv">
  <div class="rv-head">${RV_IC.film}<span><b>Ma vidéo de référence</b><small>${L.length?`${L.length} vidéo${L.length>1?"s":""} enregistrée${L.length>1?"s":""} sur cet appareil`:"Ajoutez une vraie vidéo recommandée par votre IFSI ou votre formateur"}</small></span></div>
  ${L.map((v,i)=>rvItem(id,v,i)).join("")}
  ${open?form:L.length<RV_MAX?`<button class="btn ghost block rv-add" data-act="rv-open" data-k="${esc(id)}">${IC.plus}${L.length?"Ajouter une autre vidéo":"Ajouter une vidéo de référence"}</button>`:""}</section>`;}
function rvAct(b,a){const id=b.dataset.k;
 if(a==="rv-open"){state.rvForm=id;render();setTimeout(()=>{const x=document.getElementById("rv-u");if(x){x.focus({preventScroll:true});x.scrollIntoView({block:"center"});}},40);}
 else if(a==="rv-cancel"){state.rvForm=null;render();}
 else if(a==="rv-play"){state.rvPlay=id+"/"+b.dataset.i;render();}
 else if(a==="rv-del"){if(!b.dataset.armed){b.dataset.armed="1";b.classList.add("armed");b.setAttribute("aria-label","Toucher à nouveau pour retirer");setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.classList.remove("armed");}},3500);toast("Touchez à nouveau pour retirer la vidéo");return;}
  const L=rvOf(id);L.splice(+b.dataset.i,1);rvSave(id,L);state.rvPlay=null;haptic();toast("Vidéo retirée");render();}
}
function rvSubmit(f){const id=f.dataset.k,g=k=>(document.getElementById("rv-"+k)||{}).value||"",P=rvParse(g("u"));
 if(!P){toast("Ce lien n'est pas valide");return;}
 const L=rvOf(id);if(L.length>=RV_MAX){toast(`${RV_MAX} vidéos au maximum par fiche`);return;}
 if(L.some(v=>{const q=rvParse(v.u);return q&&q.url===P.url;})){toast("Cette vidéo est déjà enregistrée");return;}
 L.push({u:P.url,t:g("t").trim().slice(0,80),s:g("s").trim().slice(0,60),d:typeof todayISO==="function"?todayISO():""});rvSave(id,L);
 state.rvForm=null;state.rvPlay=P.kind==="link"?null:id+"/"+(L.length-1);haptic();toast(P.kind==="link"?"Lien enregistré":"Vidéo ajoutée");render();
 setTimeout(()=>{const r=document.getElementById("rv");r&&r.scrollIntoView({block:"start"});},60);}
/* Liste de toutes les vidéos de référence (galerie de la boîte à outils). */
function rvList(){const A=rvAll(),ids=Object.keys(A).filter(id=>typeof SOBY!=="undefined"&&SOBY[id]&&rvOf(id).length);
 if(!ids.length)return `<section class="stack-sm"><div class="section-title"><h2>Mes vidéos de référence</h2></div><p class="muted">Dans chaque fiche de soin, vous pouvez enregistrer le lien d'une vraie vidéo recommandée par votre IFSI ou votre formateur. Elles apparaîtront ici.</p></section>`;
 return `<section class="stack-sm"><div class="section-title"><h2>Mes vidéos de référence</h2><span class="muted">${rvCount()}</span></div><div class="list">${ids.map(id=>{const L=rvOf(id),P=rvParse(L[0].u);
  return `<a class="li" href="#soin/${id}" data-act="so-open" data-k="recap"><span class="ic tb-ic" style="--c:#2E7D8C">${RV_IC.film}</span><span><span class="t">${esc(SOBY[id].n)}</span><span class="s">${L.length} vidéo${L.length>1?"s":""} · ${esc(P?P.host:"")}</span></span>${chev}</a>`;}).join("")}</div></section>`;}
