/* Carnet IFSI — export PDF sans bibliothèque externe : documents texte A4 (Helvetica), titres, paragraphes avec gras,
   tableaux répartis sur plusieurs pages, lignes à remplir et cadres de signature, numérotation des pages.
   Exports : carnet de stage complet (portfolio), feuilles de travail (recueil, projet de soins, analyse de pratique,
   planification) et parcours de stage. Sur Android et iPhone, le fichier est proposé au partage (e-mail, Drive, Fichiers…).
   Chargé après feuilles.js, carnet.js et stages-hist.js, avant app.js. */
const PDF_WR=[278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584,0,556,0,222,556,333,1000,556,556,333,1000,667,333,1000,0,611,0,0,222,222,333,333,350,556,1000,333,1000,500,333,944,0,500,667,278,333,556,556,556,556,260,556,333,737,370,556,584,0,737,552,400,549,333,333,333,576,537,333,333,333,365,556,834,834,834,611,667,667,667,667,667,667,1000,722,667,667,667,667,278,278,278,278,722,722,778,778,778,778,778,584,778,722,722,722,722,667,667,611,556,556,556,556,556,556,889,500,556,556,556,556,278,278,278,278,556,556,556,556,556,556,556,549,611,556,556,556,556,500,556,500],PDF_WB=[278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584,0,556,0,278,556,500,1000,556,556,333,1000,667,333,1000,0,611,0,0,278,278,500,500,350,556,1000,333,1000,556,333,944,0,500,667,278,333,556,556,556,556,280,556,333,737,370,556,584,0,737,552,400,549,333,333,333,576,556,333,333,333,365,556,834,834,834,611,722,722,722,722,722,722,1000,722,667,667,667,667,278,278,278,278,722,722,778,778,778,778,778,584,778,722,722,722,722,667,667,611,556,556,556,556,556,556,889,556,556,556,556,556,278,278,278,278,611,611,611,611,611,611,611,549,611,611,611,611,611,556,611,556];
const PDF_HI={"€":128,"‚":130,"ƒ":131,"„":132,"…":133,"†":134,"‡":135,"ˆ":136,"‰":137,"Š":138,"‹":139,"Œ":140,"Ž":142,"‘":145,"’":146,"“":147,"”":148,"•":149,"–":150,"—":151,"˜":152,"™":153,"š":154,"›":155,"œ":156,"ž":158,"Ÿ":159};
const PDF_SUB={"→":"->","←":"<-","↔":"<->","⇒":"=>","≥":">=","≤":"<=","≈":"~","≠":"!=","−":"-","‑":"-","‐":"-","✓":"v","✔":"v","☐":"[ ]","☑":"[x]","✗":"x","₂":"2","₁":"1","₃":"3","₄":"4","⁺":"+","⁻":"-","\u202f":" ","\u2009":" ","\u200b":"","…":"…","′":"'","″":"\"","œ":"œ"};
/* Texte → codes WinAnsi (accents français compris) */
function pdfCodes(t){const out=[];for(const ch of String(t==null?"":t).normalize("NFC")){let c=ch.codePointAt(0);
 if(c<128){if(c>=32)out.push(c);else if(c===9)out.push(32);continue;}if(c>=160&&c<=255){out.push(c);continue;}if(PDF_HI[ch]){out.push(PDF_HI[ch]);continue;}
 const s=PDF_SUB[ch];if(s!=null){for(const x of s){const k=x.codePointAt(0);out.push(k<256?k:63);}continue;}
 const base=ch.normalize("NFD").replace(/[\u0300-\u036f]/g,"");if(base&&base.codePointAt(0)<128){out.push(base.codePointAt(0));continue;}}
 return out;}
const pdfW=(codes,bold,size)=>codes.reduce((s,c)=>s+((bold?PDF_WB:PDF_WR)[c-32]||556),0)*size/1000;
const pdfStr=codes=>"("+codes.map(c=>c===40||c===41||c===92?"\\"+String.fromCharCode(c):c<128?String.fromCharCode(c):"\\"+c.toString(8).padStart(3,"0")).join("")+")";
/* « **gras** » → segments */
const pdfRuns=t=>String(t==null?"":t).replace(/==(.+?)==/g,"$1").split(/(\*\*.+?\*\*)/).filter(Boolean).map(x=>/^\*\*.+\*\*$/.test(x)?{t:x.slice(2,-2),b:1}:{t:x,b:0});

function pdfDoc(meta){
 const W=595.28,H=841.89,M=48,TOP=62,BOT=58,CW=W-2*M,pages=[];let ops=null,y=0;
 const C={ink:"0.078 0.133 0.169",muted:"0.40 0.45 0.49",brand:"0.071 0.231 0.290",line:"0.85 0.83 0.79",soft:"0.94 0.93 0.90",accent:"0.71 0.37 0.23",ok:"0.17 0.45 0.32"};
 const newPage=()=>{ops=[];pages.push(ops);y=TOP;};
 const ensure=h=>{if(!ops||y+h>H-BOT)newPage();};
 const txt=(x,yy,codes,size,bold,col,ital)=>{ops.push(`BT /${bold?"F2":ital?"F3":"F1"} ${size} Tf ${col||C.ink} rg ${x.toFixed(2)} ${(H-yy).toFixed(2)} Td ${pdfStr(codes)} Tj ET`);};
 const rect=(x,yy,w,h,col)=>ops.push(`${col} rg ${x.toFixed(2)} ${(H-yy-h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
 const strokeRect=(x,yy,w,h,col,lw)=>ops.push(`${col||C.line} RG ${lw||.6} w ${x.toFixed(2)} ${(H-yy-h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`);
 const hline=(x1,x2,yy,col,lw)=>ops.push(`${col||C.line} RG ${lw||.6} w ${x1.toFixed(2)} ${(H-yy).toFixed(2)} m ${x2.toFixed(2)} ${(H-yy).toFixed(2)} l S`);
 /* Découpe en lignes d'une suite de segments, avec retours à la ligne explicites */
 function wrap(text,size,width,boldAll){const lines=[];
  String(text==null?"":text).split("\n").forEach(par=>{let line=[],w=0;const sp=pdfW([32],0,size);
   const words=[];pdfRuns(par).forEach(r=>r.t.split(/(\s+)/).forEach(t=>{if(t)words.push({t,b:boldAll||r.b,s:/^\s+$/.test(t)});}));
   words.forEach(wd=>{if(wd.s){if(line.length)w+=sp,line.push({codes:[32],b:wd.b,w:sp});return;}
    let codes=pdfCodes(wd.t),ww=pdfW(codes,wd.b,size);
    while(ww>width&&codes.length>1){let k=codes.length;while(k>1&&pdfW(codes.slice(0,k),wd.b,size)>width-w)k--;if(k<=1&&line.length){lines.push(line);line=[];w=0;continue;}k=Math.max(1,k);line.push({codes:codes.slice(0,k),b:wd.b,w:pdfW(codes.slice(0,k),wd.b,size)});lines.push(line);line=[];w=0;codes=codes.slice(k);ww=pdfW(codes,wd.b,size);}
    if(w+ww>width&&line.length){while(line.length&&line[line.length-1].codes[0]===32&&line[line.length-1].codes.length===1)line.pop();lines.push(line);line=[];w=0;}
    line.push({codes,b:wd.b,w:ww});w+=ww;});
   while(line.length&&line[line.length-1].codes.length===1&&line[line.length-1].codes[0]===32)line.pop();lines.push(line);});
  return lines;}
 const drawLine=(line,x,yy,size,col,ital)=>{let cx=x;line.forEach(s=>{if(s.codes.length)txt(cx,yy,s.codes,size,s.b,col,ital&&!s.b);cx+=s.w;});};
 const api={
  title(t,sub){newPage();rect(M,y-26,6,40,C.accent);txt(M+16,y,pdfCodes(t),20,1,C.brand);y+=20;if(sub){wrap(sub,10.5,CW-16).forEach(l=>{drawLine(l,M+16,y,10.5,C.muted);y+=14;});}y+=14;return api;},
  h1(t){ensure(60);y+=8;txt(M,y+12,pdfCodes(t),15,1,C.brand);y+=20;hline(M,M+CW,y,C.brand,1.2);y+=12;return api;},
  h2(t){ensure(40);y+=6;txt(M,y+10,pdfCodes(t),11.5,1,C.ink);y+=18;return api;},
  p(t,o){o=o||{};const size=o.size||10,lh=size*1.4,x=M+(o.indent||0),L=wrap(t,size,CW-(o.indent||0),o.bold);L.forEach(l=>{ensure(lh);drawLine(l,x,y+size,size,o.col||C.ink,o.ital);y+=lh;});y+=o.gap==null?5:o.gap;return api;},
  label(l,v,o){o=o||{};const size=9.5;ensure(28);txt(M,y+size,pdfCodes(l),8.5,1,C.muted);y+=size+5;
   if(v&&String(v).trim())api.p(v,{size:10,gap:7});else{api.lines(o.lines||2);}return api;},
  lines(n){for(let i=0;i<n;i++){ensure(18);y+=16;hline(M,M+CW,y,C.line,.5);}y+=8;return api;},
  list(items,o){o=o||{};items.filter(x=>x!=null&&String(x).trim()).forEach(it=>{const size=10,lh=14,L=wrap(it,size,CW-14);L.forEach((l,k)=>{ensure(lh);if(!k)txt(M+2,y+size,pdfCodes(o.check?"[ ]":"•"),size,0,C.accent);drawLine(l,M+14,y+size,size,C.ink);y+=lh;});});y+=5;return api;},
  kv(rows){const lw=CW*.32,size=9.5;rows.filter(r=>r).forEach(([k,v])=>{const L=wrap(v==null||v===""?"—":v,size,CW-lw-10),h=Math.max(1,L.length)*13+6;ensure(h);
   hline(M,M+CW,y,C.line,.4);const kl=wrap(k,size,lw-6,1);kl.forEach((l,i)=>drawLine(l,M,y+size+3+i*13,size,C.muted));L.forEach((l,i)=>drawLine(l,M+lw,y+size+3+i*13,size,C.ink));y+=Math.max(h,kl.length*13+6);});hline(M,M+CW,y,C.line,.4);y+=10;return api;},
  table(cols,rows,o){o=o||{};const size=o.size||9,lh=size*1.3,pad=4,tw=cols.reduce((s,c)=>s+c.w,0),ws=cols.map(c=>c.w/tw*CW);
   const head=()=>{const L=cols.map((c,i)=>wrap(c.h,size,ws[i]-2*pad,1)),h=Math.max(...L.map(l=>l.length))*lh+2*pad;ensure(h+lh+2*pad);rect(M,y,CW,h,C.soft);let x=M;L.forEach((l,i)=>{l.forEach((ln,k)=>drawLine(ln,x+pad,y+pad+size+k*lh,size,C.ink));x+=ws[i];});strokeRect(M,y,CW,h);y+=h;};
   head();rows.forEach(r=>{if(r.group){ensure(lh+2*pad+10);rect(M,y,CW,lh+2*pad,"0.97 0.96 0.94");drawLine(wrap(r.group,size,CW-2*pad,1)[0]||[],M+pad,y+pad+size,size,C.brand);strokeRect(M,y,CW,lh+2*pad);y+=lh+2*pad;return;}
    const L=r.map((v,i)=>wrap(v==null||v===""?"":v,size,ws[i]-2*pad)),h=Math.max(1,...L.map(l=>l.length))*lh+2*pad;
    if(y+h>H-BOT){newPage();head();}
    let x=M;L.forEach((l,i)=>{l.forEach((ln,k)=>drawLine(ln,x+pad,y+pad+size+k*lh,size,C.ink));if(i)ops.push(`${C.line} RG .6 w ${x.toFixed(2)} ${(H-y).toFixed(2)} m ${x.toFixed(2)} ${(H-y-h).toFixed(2)} l S`);x+=ws[i];});strokeRect(M,y,CW,h);y+=h;});
   y+=12;return api;},
  box(t,o){o=o||{};const size=9.5,L=wrap(t,size,CW-24),h=L.length*13.5+16;ensure(h+6);rect(M,y,CW,h,o.col||"0.93 0.95 0.95");rect(M,y,3,h,C.brand);L.forEach((l,i)=>drawLine(l,M+12,y+8+size+i*13.5,size,C.ink));y+=h+10;return api;},
  sign(labels){const n=labels.length,w=(CW-(n-1)*14)/n;ensure(96);y+=6;labels.forEach((l,i)=>{const x=M+i*(w+14);strokeRect(x,y,w,80);txt(x+8,y+16,pdfCodes(l),9,1,C.muted);});y+=92;return api;},
  space(n){y+=n||10;return api;},
  pageBreak(){newPage();return api;},
  out(){if(!pages.length)newPage();const N=pages.length,stamp=new Date().toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
   pages.forEach((P,i)=>{ops=P;const head=pdfCodes(`Carnet IFSI · ${meta.title}`);txt(M,34,head,8,0,C.muted);hline(M,M+CW,40,C.line,.4);
    hline(M,M+CW,H-40,C.line,.4);txt(M,H-28,pdfCodes(meta.foot||`Document personnel · édité le ${stamp}`),7.5,0,C.muted);const pg=pdfCodes(`${i+1} / ${N}`);txt(M+CW-pdfW(pg,0,8),H-28,pg,8,0,C.muted);});
   const objs=[],add=s=>{objs.push(s);return objs.length;};
   const font=(n,b)=>add(`<< /Type /Font /Subtype /Type1 /BaseFont /${b} /Encoding /WinAnsiEncoding >>`);
   const cat=add(""),pagesId=add(""),f1=font(1,"Helvetica"),f2=font(2,"Helvetica-Bold"),f3=font(3,"Helvetica-Oblique");
   const d=new Date(),p2=n=>String(n).padStart(2,"0"),info=add(`<< /Title ${pdfStr(pdfCodes(meta.title))} /Producer (Carnet IFSI) /Creator (Carnet IFSI) /CreationDate (D:${d.getFullYear()}${p2(d.getMonth()+1)}${p2(d.getDate())}${p2(d.getHours())}${p2(d.getMinutes())}${p2(d.getSeconds())}) >>`);
   const kids=pages.map(P=>{const s=P.join("\n");const c=add(`<< /Length ${s.length} >>\nstream\n${s}\nendstream`);return add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R /F3 ${f3} 0 R >> >> /Contents ${c} 0 R >>`);});
   objs[cat-1]=`<< /Type /Catalog /Pages ${pagesId} 0 R >>`;objs[pagesId-1]=`<< /Type /Pages /Kids [${kids.map(k=>k+" 0 R").join(" ")}] /Count ${kids.length} >>`;
   let out="%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";const offs=[];objs.forEach((o,i)=>{offs.push(out.length);out+=`${i+1} 0 obj\n${o}\nendobj\n`;});
   const xref=out.length;out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n${offs.map(o=>String(o).padStart(10,"0")+" 00000 n \n").join("")}trailer\n<< /Size ${objs.length+1} /Root ${cat} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
   const u=new Uint8Array(out.length);for(let i=0;i<out.length;i++)u[i]=out.charCodeAt(i)&255;return u;}};
 return api;}
const pdfName=(t,d)=>`${String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)}-${d||todayISO()}.pdf`;
async function pdfSave(doc,title){try{const u=doc.out();await dlFile(pdfName(title),"application/pdf",u);}catch(e){toast("Le PDF n'a pas pu être créé");}}

/* ---------- Carnet de stage (portfolio) ---------- */
function pdfCarnet(){
 const c=carnet(),st=stageInfo(),sv=cnSvc(),S=cnStats(c),objs=cnObjectifs(),title=`Carnet de stage${st.service?" · "+st.service:sv?" · "+sv.nom:""}`;
 const D=pdfDoc({title});
 D.title(title,`${st.type||"Stage"}${st.sem?" · "+st.sem:""}${st.debut?` · du ${fmtISO(st.debut)}${st.fin?" au "+fmtISO(st.fin):""}`:""}`);
 D.h1("Le stage").kv([["Lieu de stage",sv?sv.nom:""],["Service, établissement",st.service],["Type de stage",st.type],["Semestre",st.sem],["Dates",st.debut?`du ${fmtISO(st.debut)}${st.fin?" au "+fmtISO(st.fin):""}`:""],["Horaires",st.horaires],["Lieu de rendez-vous",st.adresse],["Tuteur ou tutrice",st.tuteur],["Cadre de santé",st.cadre],["Téléphone du service",st.tel]]);
 D.box(`Bilan chiffré : ${plural(S.jours,"jour")} noté${S.jours>1?"s":""} · ${plural(S.soinsSeul,"soin")} réalisé${S.soinsSeul>1?"s":""} seul·e · ${S.atteints} objectif${S.atteints>1?"s":""} atteint${S.atteints>1?"s":""} sur ${S.objs} · ${fmtH(S.minutes)} de présence · ${plural(S.abs,"absence")}`);
 D.h1("Mes objectifs de stage");
 if(objs.length)D.table([{h:"Objectif",w:5},{h:"Avancée",w:2},{h:"Exemples, remarques",w:4}],objs.map(o=>{const v=c.obj[cnHash(o)]||{};return [o,(CN_STATUTS.find(x=>x[0]===(v.statut||"todo"))||[,""])[1],v.note||""];}));else D.p("Aucun objectif saisi.",{col:"0.40 0.45 0.49"});
 const soins=cnAllSoins(c).map(([g,items])=>[g,items.filter(n=>{const v=c.soins[cnHash(n)]||{};return v.obs||v.aide||v.seul;})]).filter(x=>x[1].length);
 D.h1("Soins réalisés");
 if(soins.length){const rows=[];soins.forEach(([g,items])=>{rows.push({group:g});items.forEach(n=>{const v=c.soins[cnHash(n)]||{};rows.push([n,v.obs||"",v.aide||"",v.seul||""]);});});D.table([{h:"Soin",w:6},{h:"Observé",w:1.3},{h:"Avec aide",w:1.3},{h:"Seul·e",w:1.3}],rows);}
 else D.p("Aucun soin noté pour l'instant.",{col:"0.40 0.45 0.49"});
 D.h1("Auto-évaluation des compétences").table([{h:"Compétence",w:6},{h:"Mi-stage",w:2},{h:"Fin de stage",w:2},{h:"Exemples",w:4}],Object.entries(COMP).map(([n,t])=>{const v=c.comp[n]||{},lv=x=>x&&x!=="–"?x:"";return [`C${n}. ${t}`,lv(v.mi),lv(v.fin),v.ex||""];}),{size:8.5});
 [["mi","Bilan de mi-stage"],["fin","Bilan de fin de stage"]].forEach(([k,t])=>{const b=c.bilans[k]||{};D.h1(t+(b.date?" · "+fmtISO(b.date):""));
  [["Mes points forts","forts"],["Mes axes d'amélioration","ameliorer"],[k==="mi"?"Objectifs pour la suite du stage":"Objectifs pour le prochain stage","suite"],["Remarques du tuteur et de l'équipe","tuteur"]].forEach(([l,f])=>D.label(l,b[f],{lines:3}));});
 if(c.semaines.length){D.h1("Points d'étape de la semaine");c.semaines.slice().sort((a,b)=>(a.date||"").localeCompare(b.date||"")).forEach(w=>{D.h2(`Semaine du ${fmtISO(w.date)}`);[["Ce qui a progressé","progres"],["À travailler ensuite","travail"],["Retour du tuteur","tuteur"]].forEach(([l,f])=>{if(w[f])D.label(l,w[f]);});});}
 D.h1("Journal de bord");const J=c.journal.slice().sort((a,b)=>(a.date||"").localeCompare(b.date||""));
 if(J.length)J.forEach(j=>{D.h2(`${fmtISO(j.date)} · ${j.moment||"Journée"}${j.ressenti?" · ressenti : "+j.ressenti:""}`);[["Patients","patients"],["Soins et activités","activites"],["Ce que j'ai appris","appris"],["Difficultés","difficultes"],["À rechercher","recherches"]].forEach(([l,f])=>{if(j[f])D.label(l,j[f]);});});
 else D.p("Aucune journée notée.",{col:"0.40 0.45 0.49"});
 if(c.situations.length||c.questions.length){D.h1("Situations et questions");c.situations.forEach(s=>{D.h2(`${s.titre||"Situation"}${s.date?" · "+fmtISO(s.date):""}`);[["Description","description"],["Questionnement","questionnement"],["Liens théoriques","liens"],["Ce que j'en retiens","retenu"]].forEach(([l,f])=>{if(s[f])D.label(l,s[f]);});});
  if(c.questions.length){D.h2("Questions à poser ou à rechercher");D.list(c.questions.map(q=>`${q.done?"[x] ":""}${q.txt}`));}}
 if(c.meds.length){D.h1("Médicaments rencontrés").table([{h:"Médicament",w:3},{h:"Classe, indication",w:4},{h:"Surveillance",w:4}],c.meds.map(m=>[m.nom,m.classe,m.surv]));}
 if(c.lexique.length){D.h1("Sigles et vocabulaire").table([{h:"Terme",w:2},{h:"Signification",w:6}],c.lexique.map(l=>[l.terme,l.def]));}
 const Hh=c.heures.slice().sort((a,b)=>(a.date||"").localeCompare(b.date||""));
 if(Hh.length){D.h1("Feuille d'heures").table([{h:"Date",w:2},{h:"Type",w:2},{h:"Début",w:1.2},{h:"Fin",w:1.2},{h:"Pause",w:1.2},{h:"Durée",w:1.4}],[...Hh.map(x=>[fmtShort(at(x.date,"12:00")),x.type||"Présence",x.debut||"",x.fin||"",x.pause?x.pause+" min":"",x.type==="Absence"?"":fmtH(cnMinutes(x))]),["Total","","","","",fmtH(S.minutes)]]);}
 D.space(6).sign(["Signature de l'étudiant·e","Signature du tuteur ou de la tutrice"]);
 D.p("Document de suivi pédagogique. Aucune donnée permettant d'identifier un patient.",{size:8,col:"0.40 0.45 0.49"});
 return [D,title];}
/* ---------- Feuilles de travail ---------- */
function pdfSheet(type,inst,demo){
 const S=SHEETS[type],d=(inst&&inst.data)||{},title=`${S.titre}${demo?" · exemple":""} · ${fsTitle(type,inst||{data:d})}`;const D=pdfDoc({title});
 D.title(S.titre,demo?"Exemple rédigé (situation fictive) · Carnet IFSI":fsTitle(type,inst));
 if(type==="planif"){D.kv([["Date",d.date?fmtISO(d.date):""],["Poste",d.poste],["Horaires",d.horaires],["Secteur, chambres",d.secteur],["Référent du jour",d.referent]]);
  const P=d.patients||[];if(P.length){D.h1("Mes patients");D.table([{h:"Patient",w:2},{h:"Âge",w:1},{h:"Motif, jour",w:3},{h:"Isolement",w:1.5}],P.map((p,i)=>[fsPatLabel(p,i),p.age||"",p.motif||"",p.isolement||""]));}
  const T=(d.taches||[]).slice().sort((a,b)=>plKey(a.heure,d)-plKey(b.heure,d));if(T.length){D.h1("Mon planning");D.table([{h:"Heure",w:1.2},{h:"Patient",w:2},{h:"Soin ou action",w:5},{h:"Fait",w:1}],T.map(t=>{const p=P.find(x=>x.id===t.patient);return [t.heure||"",p?fsPatLabel(p,P.indexOf(p)):t.patient||"",t.tache||"",t.fait?"oui":""];}));}
  if(d.transmissions)D.h1("À transmettre").p(d.transmissions);}
 else S.sections.forEach(sec=>{D.h1(sec.h);
  if(sec.g){const items=d[sec.g.k]||[];if(!items.length)D.p("Rien de saisi.",{col:"0.40 0.45 0.49"});items.forEach((it,i)=>{D.h2(`${sec.g.label} ${i+1}${it.type?" · "+it.type:""}`);sec.g.f.filter(f=>f.k!=="type").forEach(f=>D.label(f.l,it[f.k],{lines:2}));});}
  else{const short=sec.f.filter(f=>f.t!=="textarea"),long=sec.f.filter(f=>f.t==="textarea");if(short.length)D.kv(short.map(f=>[f.l,f.t==="date"&&d[f.k]?fmtISO(d[f.k]):d[f.k]]));long.forEach(f=>D.label(f.l,d[f.k],{lines:2}));}});
 D.space(4).p("Initiales seulement : aucune donnée permettant d'identifier un patient. Un document imprimé reste dans le service et se détruit en fin de stage.",{size:8,col:"0.40 0.45 0.49"});
 return [D,title];}
/* ---------- Parcours de stage ---------- */
function pdfParcours(){
 const L=(typeof stagesHist==="function"?stagesHist():[]).slice().sort((a,b)=>(a.stage.debut||"").localeCompare(b.stage.debut||"")),title="Mon parcours de stage";const D=pdfDoc({title});
 const weeks=L.reduce((n,r)=>n+(typeof shWeeks==="function"?shWeeks(r):0),0);
 D.title(title,`${plural(L.length,"stage")} · ${typeof fmtWeeks==="function"?fmtWeeks(weeks):weeks} semaine${weeks>1?"s":""}`);
 D.h1("Types de stage").table([{h:"Type de stage",w:5},{h:"Réalisé",w:1.5}],STAGE_TYPES.map(t=>[t,L.some(r=>r.stage.type===t)?"oui":"à faire"]));
 D.h1("Stages réalisés");
 if(!L.length)D.p("Aucun stage archivé pour l'instant : un stage terminé est rangé automatiquement dans l'historique.",{col:"0.40 0.45 0.49"});
 L.forEach(r=>{const s=r.stage,c=Object.assign({obj:{},comp:{},bilans:{fin:{}}},r.carnet||{});D.h2(`${s.service||"Stage"}${s.type?" · "+s.type:""}`);
  D.kv([["Dates",s.debut?`du ${fmtISO(s.debut)}${s.fin?" au "+fmtISO(s.fin):""}`:""],["Semestre",s.sem],["Tuteur ou tutrice",s.tuteur]]);
  const objs=(s.objectifs||"").split("\n").map(l=>l.replace(/^[\s•\-–*]+/,"").trim()).filter(Boolean);if(objs.length)D.label("Objectifs",objs.map(o=>`• ${o}${(c.obj[cnHash(o)]||{}).statut==="ok"?" (atteint)":""}`).join("\n"));
  const b=(c.bilans||{}).fin||{};if(b.forts)D.label("Points forts (bilan de fin de stage)",b.forts);if(b.ameliorer)D.label("Axes d'amélioration",b.ameliorer);});
 return [D,title];}
function pdfAct(b,a){
 if(a==="pdf-carnet"){const [D,t]=pdfCarnet();pdfSave(D,t);}
 else if(a==="pdf-parcours"){const [D,t]=pdfParcours();pdfSave(D,t);}
 else if(a==="pdf-fs"){const type=b.dataset.k,id=b.dataset.id;const inst=id==="exemple"?{data:FS_DEMO[type]}:fsInst(type,id);if(!inst)return;const [D,t]=pdfSheet(type,inst,id==="exemple");pdfSave(D,t);}
}
