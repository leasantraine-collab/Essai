/* Carnet IFSI — cartes de révision écrites par l'étudiant.
   Question / réponse ou texte à trous, explication facultative, carte inversée, rangement en paquets,
   lien vers un contenu de l'appli, ajout d'une liste collée ou d'un fichier (Quizlet, Anki, tableur),
   partage d'un paquet en fichier texte. Les cartes suivent la même répétition espacée que les autres (srs.js).
   Les données restent sur l'appareil (clé « mycards ») et sont incluses dans la sauvegarde des Réglages.
   Chargé après srs.js, avant app.js. */
const MC_IC={pen:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
 list:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg>',
 share:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>'};
const MC_DEF="Mes cartes",MC_MAXQ=600,MC_MAXA=1500,MC_MAXP=40;
const mcAll=()=>{const L=store.get("mycards",[]);return Array.isArray(L)?L:[];};
function mcStore(L){store.set("mycards",L);srsReset();}
const mcId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const mcPlain=t=>String(t||"").replace(/\*\*|==/g,"").replace(/\s+/g," ").trim();
const mcCut=(t,n)=>{t=mcPlain(t);return t.length>n?t.slice(0,n-1).replace(/\s+\S*$/,"")+"…":t;};
const mcHole=t=>/\*\*[^*]+?\*\*/.test(t||"");
/* Titre du contenu lié (pathologie, soin, cours…) */
function mcLinkItem(k){if(!k)return null;const [t,id]=k.split(/:(.*)/s);
 if(t==="a"){const f=typeof AF!=="undefined"&&AF.find(x=>x.id===id);return f?{titre:f.t,h:"outil/urgences/"+id}:null;}
 const it=typeof ctItem==="function"?ctItem(t,id):null;return it?{titre:it.titre,h:({f:"fiche",c:"cours",p:"patho",s:"soin",m:"med"})[t]+"/"+id}:null;}

/* ---------- Cartes vues par la répétition espacée ---------- */
function mcCards(){return mcAll().filter(r=>r&&r.id&&r.q).map(r=>{const L=mcLinkItem(r.k),cloze=r.t==="cloze";
 const c={id:"u#"+r.id,key:L?r.k:"u:"+r.id,type:cloze?"cloze":"qa",q:r.q,a:cloze?r.q:(r.a||""),ctx:(r.p||MC_DEF)+(L?" · "+L.titre:""),user:r.id,deck:r.p||MC_DEF};
 if(r.x)c.ex=r.x;return c;});}
/* [nom du paquet, nombre de cartes], du plus récemment utilisé au plus ancien */
function mcPaquets(){const m=new Map();mcAll().forEach(r=>{const p=r.p||MC_DEF,o=m.get(p)||{n:0,t:0};o.n++;o.t=Math.max(o.t,r.m||r.c||0);m.set(p,o);});
 return [...m.entries()].sort((a,b)=>b[1].t-a[1].t).map(([p,o])=>[p,o.n]);}
const mcLastP=()=>{const p=store.get("mcLast","");return p&&mcPaquets().some(x=>x[0]===p)?p:(mcPaquets()[0]||[MC_DEF])[0];};
/* Le paquet rejoint les révisions du jour s'il n'y est pas déjà */
function mcAutoDeck(p){const S=srsSet();if(S.decks.includes("mes")||S.decks.includes("mes:"+p))return false;S.decks=[...S.decks,"mes:"+p];store.set("srsSet",S);return true;}
function mcStatus(id,st,t){const s=st["u#"+id];if(!s)return ["Nouvelle","new"];if(s[0]<=t)return ["À revoir","due"];const d=s[0]-t;return [d===1?"Demain":`Dans ${srsIvTxt(d)}`,"ok"];}

/* ---------- Bloc sur l'accueil des cartes ---------- */
function mcHome(){
 const L=mcAll(),P=mcPaquets();
 if(!L.length)return `<section class="mc-home"><div class="mc-h-top"><span class="nt-ic">${MC_IC.pen}</span><div><h2>Mes cartes</h2>
   <small>Écrivez vos propres cartes : une définition, une valeur normale, un piège vu en cours ou en stage. Elles reviennent au bon moment, comme les autres.</small></div></div>
   <div class="mc-acts"><a class="btn" href="#mescartes/new">${IC.plus}Créer une carte</a><a class="btn ghost" href="#mescartes/import">${MC_IC.list}Ajouter une liste</a></div></section>`;
 const cn=srsCounts(srsDeckCards("mes"));
 return `<section class="mc-home"><div class="mc-h-top"><span class="nt-ic">${MC_IC.pen}</span><div><div class="mc-h-row"><h2>Mes cartes</h2><a class="link" href="#mescartes">Gérer</a></div>
   <small>${plural(L.length,"carte")} · ${plural(P.length,"paquet")}${cn.due?` · ${cn.due} à revoir`:""}${cn.nw?` · ${cn.nw} nouvelle${cn.nw>1?"s":""}`:""}</small></div></div>
  <div class="mc-acts">${cn.due+cn.nw?`<button class="btn" data-act="mc-go">${IC.play}Réviser mes cartes</button>`:`<button class="btn ghost" data-act="mc-go">${IC.play}Revoir mes cartes</button>`}<a class="btn ghost" href="#mescartes/new">${IC.plus}Créer une carte</a></div></section>`;
}

/* ---------- Pages « Mes cartes » ---------- */
function vMesCartes(arg){
 const [m,...rest]=(arg||"").split("/"),x=decodeURIComponent(rest.join("/"));
 if(m==="new"||m==="edit")return mcEditor(m,x);
 if(m==="import")return mcImport();
 return mcListView();
}
const mcBack=(h,l)=>`<a class="back" href="#${h}">${IC.back}${esc(l)}</a>`;
function mcListView(){
 const L=mcAll(),P=mcPaquets(),st=srsSt(),t=srsDayN(),S=srsSet(),q=(state.mcq||"").trim().toLowerCase();
 const head=`${mcBack("entrainer/cartes","Cartes")}${vh("Cartes de révision","Mes cartes",L.length?`${plural(L.length,"carte")} dans ${plural(P.length,"paquet")}. Elles reviennent dans vos révisions du jour, comme les autres cartes.`:"Écrivez les cartes qui vous aident vraiment : vos mots, vos exemples, vos pièges.")}
  <div class="mc-acts"><a class="btn" href="#mescartes/new">${IC.plus}Créer une carte</a><a class="btn ghost" href="#mescartes/import">${MC_IC.list}Ajouter une liste</a></div>`;
 if(!L.length)return `<div class="stack-lg">${head}
  <div class="callout"><b>Comment faire de bonnes cartes</b><ul class="clean mc-tips"><li>Une seule idée par carte : « Valeur normale de la kaliémie ? » plutôt que tout le ionogramme.</li><li>Formulez la question comme on vous la poserait en partiel ou en stage.</li><li>Pour une phrase à retenir, choisissez « Texte à trous » et cachez le mot clé.</li><li>Ajoutez une explication ou un moyen mnémotechnique au verso.</li></ul></div>
  <p class="disclaimer">Vos cartes restent sur cet appareil et sont incluses dans la sauvegarde des Réglages. N'y écrivez aucune donnée permettant d'identifier un patient.</p></div>`;
 const secs=P.map(([p,n],pi)=>{const R=L.filter(r=>(r.p||MC_DEF)===p).sort((a,b)=>(b.m||b.c||0)-(a.m||a.c||0)),cn=srsCounts(srsDeckCards("mes:"+p),st,t),on=S.decks.includes("mes:"+p)||S.decks.includes("mes");
  const ren=state.mcRen===p?`<form id="mc-ren-form" class="cd-form mc-ren" data-k="${esc(p)}" autocomplete="off"><label for="mc-ren">Nouveau nom du paquet<input id="mc-ren" maxlength="${MC_MAXP}" value="${esc(p)}" required></label>
    <div class="btn-row"><button class="btn sm" type="submit">Renommer</button><button class="link" type="button" data-act="mc-ren-cancel">Annuler</button></div></form>`:"";
  const rows=R.map(r=>{const [lab,cls]=mcStatus(r.id,st,t),txt=(r.q+" "+(r.a||"")+" "+(r.x||"")).toLowerCase();
   return `<a class="li mc-row" href="#mescartes/edit/${esc(r.id)}" data-txt="${esc(mcPlain(txt))}"${q&&!mcPlain(txt).includes(q)?" hidden":""}><span><span class="t">${esc(mcCut(r.q,140))}</span><span class="s">${r.t==="cloze"?"Texte à trous":esc(mcCut(r.a,110))}</span></span><span class="mc-st ${cls}">${lab}</span></a>`;}).join("");
  return `<details class="mc-deck"${pi===0||q||P.length<3?" open":""}><summary><span class="mc-d-t"><b>${esc(p)}</b><small>${plural(n,"carte")}${cn.due?` · ${cn.due} à revoir`:""}${cn.nw?` · ${cn.nw} nouvelle${cn.nw>1?"s":""}`:""}</small></span></summary>
   <div class="mc-d-acts"><button class="btn sm" data-act="mc-go" data-k="${esc(p)}">${IC.play}Réviser</button>
    <button class="chip srs-deck" data-act="srs-deck" data-k="${esc("mes:"+p)}" aria-pressed="${on}"${S.decks.includes("mes")?" disabled":""}>Dans ma révision du jour</button>
    <button class="link" data-act="mc-export" data-k="${esc(p)}">${MC_IC.share}Partager</button><button class="link" data-act="mc-ren" data-k="${esc(p)}">Renommer</button>
    <button class="link danger" data-act="mc-delp" data-k="${esc(p)}">Supprimer le paquet</button></div>${ren}
   <div class="list mc-list">${rows}</div></details>`;}).join("");
 return `<div class="stack-lg">${head}
  ${L.length>8?`<label class="mc-search"><span class="sr-only">Chercher dans mes cartes</span><input type="search" id="mc-q" data-mc="search" placeholder="Chercher dans mes cartes" value="${esc(state.mcq||"")}" autocomplete="off"></label><p class="muted mc-none" hidden>Aucune carte ne correspond.</p>`:""}
  ${secs}
  <p class="disclaimer">Vos cartes restent sur cet appareil et sont incluses dans la sauvegarde des Réglages. « Partager » crée un fichier texte qu'un·e camarade peut ajouter avec « Ajouter une liste ».</p></div>`;
}

/* ---------- Éditeur ---------- */
function mcDraftFor(m,x){
 const key=m+"/"+x;if(state.mc&&state.mcFor===key)return state.mc;
 let d;
 if(m==="edit"){const r=mcAll().find(y=>y.id===x);if(!r)return null;d={id:r.id,t:r.t==="cloze"?"cloze":"qa",q:r.q||"",a:r.a||"",x:r.x||"",p:r.p||MC_DEF,k:r.k||""};}
 else d={id:null,t:"qa",q:"",a:"",x:"",p:mcLastP(),k:mcLinkItem(x)?x:"",rev:false};
 state.mc=d;state.mcFor=key;return d;}
function mcPrev(d){
 if(d.t==="cloze"&&!mcHole(d.q))return `<p class="muted">Cachez au moins un mot pour voir la carte.</p>`;
 if(!d.q.trim()&&!(d.a||"").trim())return `<p class="muted">L'aperçu de la carte s'affiche ici.</p>`;
 const c={type:d.t,q:d.q,a:d.t==="cloze"?d.q:d.a,user:"x",ex:d.x||undefined};
 return `<div class="mc-face"><span class="mc-k">Recto</span>${srsFace(c,false)}</div><div class="mc-face verso"><span class="mc-k">Verso</span>${srsFace(c,true)}</div>`;}
function mcPChips(cur){const P=mcPaquets();if(!P.length)return "";
 return `<div class="chips wrapchips mc-pchips" role="group" aria-label="Paquets existants">${P.slice(0,12).map(([p])=>`<button type="button" class="chip" data-act="mc-pick" data-k="${esc(p)}" aria-pressed="${p===cur}">${esc(p)}</button>`).join("")}</div>`;}
function mcEditor(m,x){
 const d=mcDraftFor(m,x);if(!d)return notFound();
 const edit=!!d.id,L=mcLinkItem(d.k),cl=d.t==="cloze";
 return `<div class="stack-lg">${mcBack("mescartes","Mes cartes")}${vh("Mes cartes",edit?"Modifier la carte":"Nouvelle carte",edit?"":"Une question courte, une réponse précise : c'est ce qui se retient le mieux.")}
  <form id="mc-form" class="cd-form mc-form" autocomplete="off">
   <div class="seg ot-seg" role="group" aria-label="Type de carte" style="grid-template-columns:1fr 1fr"><button type="button" data-act="mc-type" data-k="qa" aria-pressed="${!cl}">Question / réponse</button><button type="button" data-act="mc-type" data-k="cloze" aria-pressed="${cl}">Texte à trous</button></div>
   ${cl?`<label for="mc-q">Phrase à retenir<textarea id="mc-q" data-mc="q" rows="4" maxlength="${MC_MAXA}" placeholder="Ex. La kaliémie normale est comprise entre **3,5 et 5** mmol/L.">${esc(d.q)}</textarea></label>
    <div class="mc-hole-row"><button type="button" class="btn sm ghost" data-act="mc-hole">Cacher le mot sélectionné</button><small class="ot-hint">Sélectionnez un mot puis touchez le bouton, ou entourez-le de deux astérisques : **mot**.</small></div>`
   :`<label for="mc-q">Question (recto)<textarea id="mc-q" data-mc="q" rows="3" maxlength="${MC_MAXQ}" placeholder="Ex. Quelle est la valeur normale de la kaliémie ?">${esc(d.q)}</textarea></label>
    <label for="mc-a">Réponse (verso)<textarea id="mc-a" data-mc="a" rows="4" maxlength="${MC_MAXA}" placeholder="Ex. 3,5 à 5 mmol/L">${esc(d.a)}</textarea></label>
    <small class="ot-hint mc-fmt">**mot** met en gras ; une ligne qui commence par « - » devient une liste.</small>`}
   <label for="mc-x"><span>Explication ou moyen mnémotechnique <span class="mc-opt">facultatif</span></span><textarea id="mc-x" data-mc="x" rows="2" maxlength="${MC_MAXA}" placeholder="Affichée au verso, sous la réponse">${esc(d.x)}</textarea></label>
   <label for="mc-p">Paquet<input id="mc-p" data-mc="p" maxlength="${MC_MAXP}" placeholder="${MC_DEF}" value="${esc(d.p)}"></label>${mcPChips(d.p)}
   ${L?`<div class="mc-link"><span>Liée à <a href="#${L.h}">${esc(L.titre)}</a></span><button type="button" class="link" data-act="mc-unlink">Retirer le lien</button></div>`:""}
   ${!edit&&!cl?`<label class="chk mc-rev"><input type="checkbox" id="mc-rev" data-mc="rev" ${d.rev?"checked":""}><span>Créer aussi la carte inversée (la réponse devient la question)</span></label>`:""}
   <section class="mc-prev" aria-label="Aperçu" id="mc-prev">${mcPrev(d)}</section>
   <div class="btn-row"><button class="btn" type="submit">Enregistrer</button>${edit?"":`<button class="btn ghost" type="button" data-act="mc-save-next">Enregistrer et en créer une autre</button>`}</div>
   ${edit?`<button type="button" class="link danger" data-act="mc-del">Supprimer cette carte</button>`:""}
   <small class="ot-hint">N'écrivez aucune donnée permettant d'identifier un patient.</small></form></div>`;
}
function mcRead(){const d=state.mc;if(!d)return null;const v=id=>{const e=document.getElementById(id);return e?e.value:null;};
 const q=v("mc-q"),a=v("mc-a"),x=v("mc-x"),p=v("mc-p");if(q!=null)d.q=q;if(a!=null)d.a=a;if(x!=null)d.x=x;if(p!=null)d.p=p;return d;}
function mcSave(next){
 const d=mcRead();if(!d)return;const q=d.q.trim(),a=(d.a||"").trim(),x=(d.x||"").trim(),p=(d.p||"").trim().slice(0,MC_MAXP)||MC_DEF;
 if(d.t==="cloze"){if(!mcHole(q)){toast("Cachez au moins un mot : sélectionnez-le puis « Cacher le mot »");return;}}
 else if(!q||!a){toast(q?"Écrivez la réponse":"Écrivez la question");const e=document.getElementById(q?"mc-a":"mc-q");e&&e.focus();return;}
 const L=mcAll(),now=Date.now(),rec={t:d.t,q,p,m:now};if(d.t!=="cloze")rec.a=a;if(x)rec.x=x;if(d.k)rec.k=d.k;
 let added=false;
 if(d.id){const i=L.findIndex(r=>r.id===d.id);if(i<0){toast("Cette carte n'existe plus");return;}L[i]=Object.assign({id:d.id,c:L[i].c||now},rec);mcStore(L);toast("Carte modifiée");}
 else{const n={id:mcId(),c:now,...rec};L.push(n);
  if(d.rev&&d.t!=="cloze"){const r2={id:mcId(),c:now,t:"qa",q:a,a:q,p,m:now};if(x)r2.x=x;if(d.k)r2.k=d.k;L.push(r2);}
  mcStore(L);added=mcAutoDeck(p);toast((d.rev&&d.t!=="cloze"?"2 cartes enregistrées":"Carte enregistrée")+` dans « ${p} »`+(added?" · ajoutée à vos révisions du jour":""));}
 store.set("mcLast",p);haptic();
 if(next&&!d.id){state.mc=Object.assign({},d,{q:"",a:"",x:"",p,rev:d.rev});render();setTimeout(()=>{const e=document.getElementById("mc-q");e&&e.focus();},40);return;}
 mcLeave();}
function mcLeave(){state.mc=null;state.mcFor=null;if(typeof depth!=="undefined"&&depth>0)history.back();else location.replace("#mescartes");}
function mcDelCards(ids){const S=new Set(ids),st=srsSt();mcStore(mcAll().filter(r=>!S.has(r.id)));ids.forEach(i=>delete st["u#"+i]);store.set("srs",st);}
const mcPrevUpdate=()=>{const e=document.getElementById("mc-prev");if(e&&state.mc)e.innerHTML=mcPrev(state.mc);};

/* ---------- Ajouter une liste ---------- */
const mcUnHtml=t=>String(t).replace(/<br\s*\/?>/gi,"\n").replace(/<\/(div|p|li)>/gi,"\n").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&").replace(/\n{3,}/g,"\n\n").trim();
const mcUnq=t=>{t=t.trim();return /^".*"$/s.test(t)?t.slice(1,-1).replace(/""/g,'"'):t;};
function mcParse(txt){const out=[];let bad=0;
 String(txt||"").replace(/\r\n?/g,"\n").split("\n").forEach(l=>{if(!l.trim()||/^#\w+:/.test(l.trim()))return;
  let q,a,i;
  if((i=l.indexOf("\t"))>=0){q=l.slice(0,i);a=l.slice(i+1).split("\t")[0];}
  else if((i=l.indexOf(";"))>0){q=l.slice(0,i);a=l.slice(i+1);}
  else if((i=l.indexOf(" = "))>0){q=l.slice(0,i);a=l.slice(i+3);}
  else{q=l;a="";}
  q=mcUnHtml(mcUnq(q)).slice(0,MC_MAXQ);a=mcUnHtml(mcUnq(a)).slice(0,MC_MAXA);
  if(q&&a)out.push({t:"qa",q,a});else if(q&&mcHole(q))out.push({t:"cloze",q:q.slice(0,MC_MAXA)});else bad++;});
 return {cards:out.slice(0,2000),bad};}
function mcImpPrev(){const e=document.getElementById("mc-imp-prev");if(!e)return;const ta=document.getElementById("mc-it"),R=mcParse(ta?ta.value:"");
 e.innerHTML=R.cards.length||R.bad?`<p><b>${plural(R.cards.length,"carte")} reconnue${R.cards.length>1?"s":""}</b>${R.bad?` · ${plural(R.bad,"ligne")} sans séparateur ignorée${R.bad>1?"s":""}`:""}</p>
  ${R.cards.length?`<ul class="clean mc-imp-l">${R.cards.slice(0,4).map(c=>`<li><b>${esc(mcCut(c.q,80))}</b>${c.t==="cloze"?" <small>· texte à trous</small>":` <span class="muted">→ ${esc(mcCut(c.a,70))}</span>`}</li>`).join("")}${R.cards.length>4?`<li class="muted">… et ${R.cards.length-4} autre${R.cards.length-4>1?"s":""}</li>`:""}</ul>`:""}`:"";
 const b=document.getElementById("mc-imp-go");if(b){b.disabled=!R.cards.length;b.textContent=R.cards.length?`Ajouter ${R.cards.length>1?"les "+R.cards.length+" cartes":"la carte"}`:"Ajouter les cartes";}}
function mcImport(){
 const p=state.mcImpP!=null?state.mcImpP:mcLastP(),txt=state.mcImpT||"";
 return `<div class="stack-lg">${mcBack("mescartes","Mes cartes")}${vh("Mes cartes","Ajouter une liste","Collez une liste, une carte par ligne, ou ouvrez un fichier exporté de Quizlet, d'Anki, d'un tableur ou partagé par un·e camarade.")}
  <form id="mc-imp-form" class="cd-form mc-form" autocomplete="off">
   <label for="mc-ip">Paquet<input id="mc-ip" data-mc="ip" maxlength="${MC_MAXP}" placeholder="${MC_DEF}" value="${esc(p)}"></label>${mcPChips(p).replace(/mc-pick/g,"mc-ipick")}
   <label for="mc-it">Vos cartes<textarea id="mc-it" data-mc="it" rows="9" placeholder="Kaliémie normale ; 3,5 à 5 mmol/L&#10;Natrémie normale ; 135 à 145 mmol/L&#10;Le pH artériel normal est de **7,38 à 7,42**.">${esc(txt)}</textarea></label>
   <small class="ot-hint">Séparez la question de la réponse par une tabulation (Quizlet, Anki), un point-virgule ou « = ». Une ligne sans séparateur, avec des **mots entre astérisques**, devient un texte à trous.</small>
   <label class="btn ghost mc-file" for="mc-file">${MC_IC.list}Ouvrir un fichier (.txt, .csv, .tsv)<input type="file" id="mc-file" data-mc="file" accept=".txt,.csv,.tsv,text/plain,text/csv,text/tab-separated-values" hidden></label>
   <div id="mc-imp-prev" class="mc-imp-prev" aria-live="polite"></div>
   <button class="btn" type="submit" id="mc-imp-go" disabled>Ajouter les cartes</button></form></div>`;
}
function mcImpSubmit(){
 const ta=document.getElementById("mc-it"),pi=document.getElementById("mc-ip"),R=mcParse(ta?ta.value:"");
 if(!R.cards.length){toast("Aucune carte reconnue : vérifiez les séparateurs");return;}
 const p=((pi&&pi.value)||"").trim().slice(0,MC_MAXP)||MC_DEF,now=Date.now(),L=mcAll();
 R.cards.forEach((c,i)=>L.push(Object.assign({id:mcId()+i.toString(36),c:now,m:now,p},c)));
 mcStore(L);const added=mcAutoDeck(p);store.set("mcLast",p);state.mcImpT="";state.mcImpP=null;haptic();
 toast(`${plural(R.cards.length,"carte")} ajoutée${R.cards.length>1?"s":""} dans « ${p} »${added?" · paquet ajouté à vos révisions du jour":""}`);
 location.replace("#mescartes");}

/* ---------- Partager un paquet ---------- */
const mcEnc=t=>String(t||"").replace(/\t/g," ").replace(/\r?\n/g,"<br>");
function mcExport(p){const R=mcAll().filter(r=>(r.p||MC_DEF)===p);if(!R.length)return;
 const txt=R.map(r=>r.t==="cloze"?mcEnc(r.q):mcEnc(r.q)+"\t"+mcEnc(r.a)).join("\n")+"\n";
 const slug=p.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w]+/g,"-").replace(/^-|-$/g,"").toLowerCase()||"cartes";
 dlFile(`cartes-${slug}.txt`,"text/plain;charset=utf-8",txt);}

/* ---------- Actions et saisie ---------- */
function mcAct(b,a){const k=b.dataset.k;
 if(a==="mc-go"){const d=k?"mes:"+k:"mes";srsStart(srsDeckCards(d),k||"Mes cartes",{all:true,cram:true});}
 else if(a==="mc-type"){mcRead();state.mc.t=k==="cloze"?"cloze":"qa";render();}
 else if(a==="mc-pick"){mcRead();state.mc.p=k;render();}
 else if(a==="mc-ipick"){const e=document.getElementById("mc-ip");if(e)e.value=k;state.mcImpP=k;b.parentElement.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed",c===b));}
 else if(a==="mc-unlink"){mcRead();state.mc.k="";render();}
 else if(a==="mc-save-next")mcSave(true);
 else if(a==="mc-hole"){const ta=document.getElementById("mc-q");if(!ta)return;let s=ta.selectionStart,e=ta.selectionEnd;
  if(s===e&&state.mcSel){[s,e]=state.mcSel;}
  const v=ta.value;while(s<e&&/\s/.test(v[s]))s++;while(e>s&&/\s/.test(v[e-1]))e--;
  if(s>=e){toast("Sélectionnez d'abord le mot à cacher");ta.focus();return;}
  if(/\*\*/.test(v.slice(s,e))){toast("Ce passage est déjà caché");return;}
  ta.value=v.slice(0,s)+"**"+v.slice(s,e)+"**"+v.slice(e);state.mc.q=ta.value;state.mcSel=null;mcPrevUpdate();haptic();ta.focus();try{ta.setSelectionRange(e+4,e+4);}catch(x){}}
 else if(a==="mc-del"){if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher à nouveau pour supprimer";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Supprimer cette carte";}},4000);return;}
  mcDelCards([state.mc.id]);haptic("MEDIUM");toast("Carte supprimée");mcLeave();}
 else if(a==="mc-delp"){const R=mcAll().filter(r=>(r.p||MC_DEF)===k);
  if(!b.dataset.armed){b.dataset.armed="1";b.textContent=`Toucher à nouveau : supprimer ${plural(R.length,"carte")}`;setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Supprimer le paquet";}},4000);return;}
  mcDelCards(R.map(r=>r.id));const S=srsSet();S.decks=S.decks.filter(d=>d!=="mes:"+k);store.set("srsSet",S);haptic("MEDIUM");toast(`Paquet « ${k} » supprimé`);render();}
 else if(a==="mc-ren"){state.mcRen=state.mcRen===k?null:k;render();setTimeout(()=>{const e=document.getElementById("mc-ren");e&&e.select();},40);}
 else if(a==="mc-ren-cancel"){state.mcRen=null;render();}
 else if(a==="mc-export")mcExport(k);
 else if(a==="mc-from-pb"){const R=state.pb&&state.pb.res;if(!R)return;const p="Mes erreurs de partiel",L=mcAll(),have=new Set(L.filter(r=>r.p===p).map(r=>r.q)),now=Date.now();let n=0;
  R.rows.forEach((x,i)=>{const q=x.q;if(x.ok||!q||!q.o||q.o[q.a]==null||have.has(q.q))return;have.add(q.q);const r={id:mcId()+i.toString(36),c:now,m:now,t:"qa",q:q.q,a:"**"+String(q.o[q.a]).replace(/\*\*/g,"")+"**",p};if(q.e)r.x=q.e;L.push(r);n++;});
  if(!n){toast("Ces erreurs sont déjà dans vos cartes");return;}mcStore(L);const added=mcAutoDeck(p);haptic();
  toast(`${plural(n,"carte")} ajoutée${n>1?"s":""} dans « ${p} »${added?" · paquet ajouté à vos révisions du jour":""}`);b.disabled=true;b.textContent="Erreurs ajoutées à mes cartes";}
 else if(a==="mc-copy"){const c=srsCards().find(x=>x.id===k);if(!c)return;const kk=c.key.split(":")[0];
  state.mc={id:null,t:c.type==="cloze"?"cloze":"qa",q:c.q.replace(/\s+\?$/," ?"),a:c.type==="cloze"?"":Array.isArray(c.a)?c.a.map(x=>"- "+x).join("\n"):String(c.a||""),x:c.ex||"",p:mcLastP(),k:/^[fcpsma]$/.test(kk)&&mcLinkItem(c.key)?c.key:"",rev:false};
  state.mcFor="new/";location.hash="mescartes/new";}
}
function mcRenSubmit(f){const old=f.dataset.k,e=document.getElementById("mc-ren"),nw=(e&&e.value||"").trim().slice(0,MC_MAXP);
 if(!nw){toast("Indiquez un nom");return;}if(nw===old){state.mcRen=null;render();return;}
 const merge=mcPaquets().some(x=>x[0]===nw);mcStore(mcAll().map(r=>(r.p||MC_DEF)===old?Object.assign({},r,{p:nw}):r));
 const S=srsSet();S.decks=[...new Set(S.decks.map(d=>d==="mes:"+old?"mes:"+nw:d))];store.set("srsSet",S);if(store.get("mcLast","")===old)store.set("mcLast",nw);
 state.mcRen=null;haptic();toast(merge?`Cartes réunies dans « ${nw} »`:"Paquet renommé");render();}
function mcInput(t){const f=t.dataset.mc;
 if(f==="search"){state.mcq=t.value;const q=t.value.trim().toLowerCase();let n=0;
  document.querySelectorAll(".mc-row").forEach(r=>{const ok=!q||r.dataset.txt.includes(q);r.hidden=!ok;if(ok)n++;});
  if(q)document.querySelectorAll(".mc-deck").forEach(d=>{d.open=!!d.querySelector(".mc-row:not([hidden])");});
  const e=document.querySelector(".mc-none");if(e)e.hidden=n>0;return;}
 if(f==="it"){state.mcImpT=t.value;mcImpPrev();return;}
 if(f==="ip"){state.mcImpP=t.value;return;}
 if(f==="file"){const F=t.files&&t.files[0];if(!F)return;if(F.size>2e6){toast("Fichier trop volumineux");t.value="";return;}
  const r=new FileReader();r.onload=()=>{const ta=document.getElementById("mc-it");if(!ta)return;const v=String(r.result||"");ta.value=ta.value.trim()?ta.value.replace(/\s*$/,"\n")+v:v;state.mcImpT=ta.value;mcImpPrev();toast("Fichier chargé : vérifiez puis ajoutez");};
  r.onerror=()=>toast("Lecture du fichier impossible");r.readAsText(F);t.value="";return;}
 if(!state.mc)return;
 if(f==="rev"){state.mc.rev=t.checked;return;}
 state.mc[f]=t.value;if(f==="q"||f==="a"||f==="x")mcPrevUpdate();
 if(f==="p")document.querySelectorAll(".mc-pchips .chip").forEach(c=>c.setAttribute("aria-pressed",c.dataset.k===t.value.trim()));}
/* Garde la sélection de la phrase pour « Cacher le mot » (sur mobile, toucher le bouton retire le focus) */
document.addEventListener("selectionchange",()=>{const a=document.activeElement;if(a&&a.id==="mc-q"&&a.selectionEnd>a.selectionStart)state.mcSel=[a.selectionStart,a.selectionEnd];});
document.addEventListener("mousedown",e=>{if(e.target.closest&&e.target.closest('[data-act="mc-hole"]'))e.preventDefault();});
