(function(){
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEY='resume-gen-harvard-ph-v2';
const DIMS={letter:{w:816,h:1056,tw:12240,th:15840},a4:{w:794,h:1123,tw:11906,th:16838}};

const KINDS={
  education:{org:'School / university',loc:'Location',role:'Degree, strand or course',dates:'Dates (e.g., June 2020 – May 2024)',bul:'Details, one per line (honors, GPA, thesis, coursework)'},
  experience:{org:'Company / organization',loc:'Location (City)',role:'Position title',dates:'Dates (e.g., June 2024 – Present)',bul:'Accomplishments, one per line (start with an action verb)'},
  leadership:{org:'Organization',loc:'Location',role:'Role',dates:'Dates',bul:'Accomplishments, one per line'},
  trainings:{org:'Organizer / provider',loc:'Venue (or Online)',role:'Seminar / training title',dates:'Date(s)',bul:'Notes, one per line (optional)'},
  licenses:{org:'Issuing body (e.g., Civil Service Commission, PRC)',loc:'Place of exam / issuance',role:'Certification, eligibility or license',dates:'Date',bul:'Details, one per line (rating, license no. if you wish)'},
  refs:{org:'Name',loc:'Contact (mobile / email)',role:'Position & organization',dates:'',bul:''}
};
const blank=k=>k==='skills'?{label:'',items:''}:{org:'',loc:'',title:'',dates:'',bullets:''};
const LISTS=['education','experience','leadership','trainings','licenses','refs','skills'];

const SAMPLE={
  preset:'ph',paper:'letter',order:'edu',refsMode:'list',
  name:'Maria Clara Santos',address:'Blk 5 Lot 12, Mabini Street, Brgy. Poblacion, Makati City, Metro Manila 1210',phone:'+63 917 123 4567',email:'maria.santos@email.com',linkedin:'linkedin.com/in/mariasantos',website:'',
  objective:'Entry-level cybersecurity technician with hands-on SOC monitoring and incident response experience.',
  education:[
    {org:'Metro Manila State University',loc:'Makati City',title:'Bachelor of Science in Information Technology, Major in Network and Information Security',dates:'June 2020 – May 2024',bullets:'Graduated Cum Laude; Academic Scholar (8 semesters)\nThesis: Anomaly-Based Intrusion Detection for Small-Office Networks'},
    {org:'Poblacion Senior High School',loc:'Makati City',title:'Senior High School, Information and Communications Technology (ICT) Strand, With Honors',dates:'June 2018 – March 2020',bullets:''}],
  experience:[
    {org:'Sample Managed Security Services, Inc.',loc:'Taguig City',title:'Junior SOC Analyst',dates:'June 2024 – Present',bullets:'Triaged 60+ alerts per shift in Splunk, escalating confirmed incidents within a 15-minute SLA\nInvestigated phishing and malware cases with playbooks, cutting containment time by 30%\nTuned 25 SIEM detection rules, reducing false positives by 40%'},
    {org:'Sample Corporation, IT Department',loc:'Makati City',title:'IT Security Intern',dates:'January 2024 – April 2024',bullets:'Hardened 40 Windows workstations to CIS benchmarks and applied monthly patches at 98% compliance'}],
  leadershipTitle:'Leadership & Activities',
  leadership:[{org:'Cybersecurity Society',loc:'Metro Manila State University',title:'Vice President, Technical Affairs',dates:'June 2022 – March 2023',bullets:'Led a 6-member Capture the Flag team to 3rd place among 30 university teams'}],
  skills:[{label:'Security Tools',items:'Splunk, Wireshark, Nmap, Nessus, Burp Suite, Microsoft Defender'},{label:'Systems & Networking',items:'Windows, Linux (Kali, Ubuntu), Active Directory, TCP/IP, firewalls, VLANs'},{label:'Frameworks & Scripting',items:'NIST CSF, MITRE ATT&CK, ISO 27001 (basics), Python, Bash, SQL'}],
  trainings:[{org:'Sample Training Institute',loc:'Online',title:'Incident Response and Digital Forensics Workshop',dates:'March 2025',bullets:''}],
  licenses:[{org:'CompTIA',loc:'Online',title:'Security+ (SY0-701)',dates:'Expected January 2027',bullets:''}],
  dob:'March 4, 2002',civil:'Single',citizen:'Filipino',
  refs:[{org:'Engr. Juan Dela Cruz',loc:'+63 900 000 0000',title:'SOC Manager, Sample Managed Security Services, Inc.',dates:'',bullets:''}]
};
const EMPTY={preset:'ph',paper:'letter',order:'edu',refsMode:'request',declaration:'none',name:'',address:'',phone:'',email:'',linkedin:'',website:'',objective:'',dob:'',civil:'',citizen:'',leadershipTitle:'Leadership & Activities'};
LISTS.forEach(k=>{EMPTY[k]=[blank(k)];});
const clone=o=>JSON.parse(JSON.stringify(o));

const VK='resume-gen-versions-v1';
const uid=()=>Math.random().toString(36).slice(2,9);
const norm=o=>{const r=Object.assign(clone(EMPTY),o||{});LISTS.forEach(k=>{if(!Array.isArray(r[k]))r[k]=[];});return r;};
let V=null;
try{const raw=localStorage.getItem(VK);if(raw)V=JSON.parse(raw);}catch(e){}
if(!V||!Array.isArray(V.list)||!V.list.length){
  let base=null;try{const raw=localStorage.getItem(KEY);if(raw)base=JSON.parse(raw);}catch(e){}
  V={active:'',list:[{id:uid(),name:'Main',data:norm(base||clone(SAMPLE))}]};V.active=V.list[0].id;
}
let S;
const activeV=()=>V.list.find(v=>v.id===V.active)||V.list[0];
function syncS(){const v=activeV();v.data=norm(v.data);S=v.data;V.active=v.id;}
syncS();
const saveV=()=>{try{localStorage.setItem(VK,JSON.stringify(V));}catch(e){}};
const setStatus=(sel,t)=>{const el=$(sel);if(el)el.textContent=t||'';};

/* ---------- form ---------- */
const F=(label,path,val,o)=>{o=o||{};
  const el=o.area?`<textarea data-p="${path}" rows="${o.rows||3}">${esc(val)}</textarea>`:`<input data-p="${path}" value="${esc(val)}" autocomplete="off">`;
  return `<label class="f ${o.full?'full':''}"><span>${esc(label)}</span>${el}</label>`;};
const SEL=(label,path,val,opts,full)=>`<label class="f ${full?'full':''}"><span>${esc(label)}</span><select data-p="${path}">${opts.map(o=>`<option value="${o[0]}"${o[0]===val?' selected':''}>${esc(o[1])}</option>`).join('')}</select></label>`;
const entryCard=(kind,e,i,n)=>{const K=KINDS[kind],b=kind+'.'+i;
  return `<div class="entry"><div class="ehead"><strong>${esc(e.org||e.title||'Entry '+(i+1))}</strong><span class="mini">
    <button data-act="up" data-k="${kind}" data-i="${i}" ${i===0?'disabled':''} title="Move up" aria-label="Move up">&uarr;</button>
    <button data-act="down" data-k="${kind}" data-i="${i}" ${i===n-1?'disabled':''} title="Move down" aria-label="Move down">&darr;</button>
    <button data-act="del" data-k="${kind}" data-i="${i}" title="Remove" aria-label="Remove">&times;</button></span></div>
    <div class="grid">${F(K.org,b+'.org',e.org)}${F(K.loc,b+'.loc',e.loc)}${F(K.role,b+'.title',e.title)}${K.dates?F(K.dates,b+'.dates',e.dates):''}${K.bul?F(K.bul,b+'.bullets',e.bullets,{area:1,rows:4,full:1}):''}</div></div>`;};
const listCard=(kind,title,hint,extra)=>`<section class="card"><h2>${title}</h2>${hint?`<p class="hint">${hint}</p>`:''}${extra||''}${S[kind].map((e,i)=>entryCard(kind,e,i,S[kind].length)).join('')}<button data-act="add" data-k="${kind}">+ Add entry</button></section>`;

function renderForm(){
  $('#form').innerHTML=vCard()+aiCards()+
  `<section class="card"><h2>Contact</h2><div class="grid">
    ${F('Full name','name',S.name,{full:1})}${F('Address (street, barangay, city, province, ZIP)','address',S.address,{full:1})}
    ${F('Mobile (+63 9XX XXX XXXX)','phone',S.phone)}${F('Email','email',S.email)}
    ${F('LinkedIn (plain text, optional)','linkedin',S.linkedin)}${F('Website / portfolio (optional)','website',S.website)}</div></section>`+
  (S.preset==='us'?'':`<section class="card"><h2>Career objective</h2><p class="hint">Optional, common on Philippine resumes. One or two sentences, no pronouns.</p>${F('Objective','objective',S.objective,{area:1,rows:3,full:1}).replace('class="f full"','class="f full" style="display:flex"')}</section>`)+
  listCard('education','Education','List tertiary first, then senior high or secondary, in reverse-chronological order. Include honors.')+
  listCard('experience','Experience','Reverse-chronological. Each bullet: action verb + what you did + measurable result. One or two lines each.')+
  listCard('leadership','Leadership &amp; activities','Optional. Student orgs, volunteering, projects.',F('Section heading','leadershipTitle',S.leadershipTitle,{full:1}).replace('class="f full"','class="f full" style="margin-bottom:10px"'))+
  `<section class="card"><h2>Skills &amp; interests</h2><p class="hint">Label + comma-separated items, e.g. Technical: Excel, SQL.</p>`+
  S.skills.map((k,i)=>`<div class="entry"><div class="ehead"><strong>${esc(k.label||'Row '+(i+1))}</strong><span class="mini">
    <button data-act="up" data-k="skills" data-i="${i}" ${i===0?'disabled':''} aria-label="Move up">&uarr;</button>
    <button data-act="down" data-k="skills" data-i="${i}" ${i===S.skills.length-1?'disabled':''} aria-label="Move down">&darr;</button>
    <button data-act="del" data-k="skills" data-i="${i}" aria-label="Remove">&times;</button></span></div>
    <div class="grid">${F('Label','skills.'+i+'.label',k.label)}${F('Items','skills.'+i+'.items',k.items)}</div></div>`).join('')+
  `<button data-act="add" data-k="skills">+ Add row</button></section>`+
  listCard('trainings','Seminars &amp; trainings','Optional. Relevant seminars, workshops and certifications.')+
  listCard('licenses','Certifications &amp; eligibilities','Optional. Security+, CCNA, Civil Service eligibility, PRC license and similar.')+
  (S.preset==='us'?'':`<section class="card"><h2>Personal information</h2><p class="hint">Optional. Common on Philippine resumes; leave blank for US or international applications.</p><div class="grid">
    ${F('Date of birth','dob',S.dob,{full:1})}${F('Civil status','civil',S.civil)}${F('Citizenship','citizen',S.citizen)}</div></section>`)+
  (S.preset==='us'?'':listCard('refs','References','',SEL('References section','refsMode',S.refsMode,[['list','List character references'],['request','"References available upon request."'],['none','Leave out']],1).replace('class="f full"','class="f full" style="margin-bottom:10px"')));
}

function setPath(path,val){const k=path.split('.');let o=S;for(let i=0;i<k.length-1;i++)o=o[k[i]];o[k[k.length-1]]=val;}
const onField=e=>{
  const dd=e.target.dataset&&e.target.dataset.d;
  if(dd){setIn(D,dd,e.target.value);saveDocs();return;}
  const p=e.target.dataset&&e.target.dataset.p;if(!p)return;setPath(p,e.target.value);
  if(p==='preset'){if(S.preset==='us')S.paper='letter';renderForm();if(tab==='ph')renderPhForm();}
  refresh();};
$('#form').addEventListener('input',onField);
$('#form').addEventListener('change',onField);
$('#form').addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const act=b.dataset.act,k=b.dataset.k,i=+b.dataset.i,a=S[k];
  if(act==='add')a.push(blank(k));
  else if(act==='del')a.splice(i,1);
  else if(act==='up'&&i>0){const t=a[i-1];a[i-1]=a[i];a[i]=t;}
  else if(act==='down'&&i<a.length-1){const t=a[i+1];a[i+1]=a[i];a[i]=t;}
  renderForm();refresh();
});

/* ---------- model shared by preview, docx, text ---------- */
const bulletsOf=t=>(t||'').split('\n').map(s=>s.replace(/^\s*[-•*–]\s*/,'').trim()).filter(Boolean);
function footerLines(d){
  if(d.preset==='us')return[];
  const c='I hereby certify that the above information is true and correct to the best of my knowledge.';
  if(d.declaration==='certify')return[c];
  if(d.declaration==='consent')return[c+' I consent to the collection and processing of my personal data for recruitment purposes in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).'];
  return[];
}
function model(d){
  const ent=a=>(a||[]).map(e=>({org:(e.org||'').trim(),loc:(e.loc||'').trim(),title:(e.title||'').trim(),dates:(e.dates||'').trim(),bullets:bulletsOf(e.bullets)})).filter(e=>e.org||e.title||e.bullets.length);
  const by={};
  const row=(label,items)=>({label:label,items:(items||'').trim()});
  const us=d.preset==='us';
  if(!us&&(d.objective||'').trim())by.objective={id:'objective',title:'Career Objective',skills:[row('',d.objective)]};
  const E=ent(d.education);if(E.length)by.education={id:'education',title:'Education',entries:E};
  const X=ent(d.experience);if(X.length)by.experience={id:'experience',title:'Experience',entries:X};
  const L=ent(d.leadership);if(L.length)by.leadership={id:'leadership',title:(d.leadershipTitle||'').trim()||'Leadership & Activities',entries:L};
  const K=(d.skills||[]).map(k=>row((k.label||'').trim(),k.items)).filter(k=>k.items);
  if(K.length)by.skills={id:'skills',title:'Skills & Interests',skills:K};
  const T=ent(d.trainings);if(T.length)by.trainings={id:'trainings',title:'Seminars & Trainings',entries:T};
  const Li=ent(d.licenses);if(Li.length)by.licenses={id:'licenses',title:'Certifications & Eligibilities',entries:Li};
  const P=[row('Date of Birth',d.dob),row('Civil Status',d.civil),row('Citizenship',d.citizen)].filter(k=>k.items);
  if(!us&&P.length){const one=P.map(k=>k.label+': '+k.items).join(' | ');
    by.personal={id:'personal',title:'Personal Information',skills:one.length<=95?[row('',one)]:P};}
  if(us){/* Harvard format omits references */}
  else if(d.refsMode==='list'){const R=ent(d.refs);if(R.length)by.refs={id:'refs',title:'Character References',entries:R};}
  else if(d.refsMode==='request')by.refs={id:'refs',title:'References',skills:[row('','Available upon request.')]};
  const order=(d.order==='exp'&&!us)?['objective','experience','education','leadership','skills','trainings','licenses','personal','refs']:['objective','education','experience','leadership','skills','trainings','licenses','personal','refs'];
  return{name:(d.name||'').trim(),contact:[d.address,d.phone,d.email,d.linkedin,d.website].map(s=>(s||'').trim()).filter(Boolean),sections:order.map(id=>by[id]).filter(Boolean),footer:footerLines(d)};
}

/* ---------- preview ---------- */
function resumeHTML(M){
  let h=`<div class="r-name">${esc(M.name||'Your Name')}</div>`;
  if(M.contact.length)h+=`<div class="r-contact">${M.contact.map(esc).join(' &nbsp;|&nbsp; ')}</div>`;
  M.sections.forEach(s=>{
    h+=`<div class="r-h">${esc(s.title.toUpperCase())}</div>`;
    if(s.entries)s.entries.forEach(e=>{
      h+='<div class="r-entry">';
      if(e.org||e.loc)h+=`<div class="r-row"><b>${esc(e.org)}</b><span>${esc(e.loc)}</span></div>`;
      if(e.title||e.dates)h+=`<div class="r-row"><i>${esc(e.title)}</i><span>${esc(e.dates)}</span></div>`;
      if(e.bullets.length)h+='<ul>'+e.bullets.map(b=>`<li>${esc(b)}</li>`).join('')+'</ul>';
      h+='</div>';
    });
    if(s.skills)s.skills.forEach(k=>{h+=`<div class="r-skill">${k.label?`<b>${esc(k.label)}:</b> `:''}${esc(k.items)}</div>`;});
  });
  (M.footer||[]).forEach(t=>{h+=`<div class="r-foot">${esc(t)}</div>`;});
  return h;
}
let contentH=0;
const dims=()=>DIMS[S.paper]||DIMS.letter;
function renderPreview(M){
  const D=dims();
  $('#resume').innerHTML=resumeHTML(M);
  contentH=$('#resume').offsetHeight;
  const paper=$('#paper'),stage=$('#stage'),scaler=$('#scaler');
  const s=Math.min(1,(stage.clientWidth-24)/D.w);
  const full=Math.max(D.h,contentH+144);
  paper.style.width=D.w+'px';paper.style.minHeight=D.h+'px';paper.style.height=full+'px';
  paper.style.transform='scale('+s+')';
  scaler.style.width=(D.w*s)+'px';scaler.style.height=(full*s)+'px';
  const pg=$('#pgline');pg.style.top=(D.h-72)+'px';pg.className='pgline'+(contentH>D.h-144?' over':'');
}
window.addEventListener('resize',()=>refreshActive());

/* ---------- checks ---------- */
const WEAK=/^(i|my|we|responsible for|duties|worked on|worked with|helped|tasked|assisted with|participated in|various)\b/i;
const PH_MOBILE=/^(\+?63|0)[\s-]?9\d{2}[\s-]?\d{3}[\s-]?\d{4}$/;
const PH_LAND=/^(\+?63|0)?[\s-]?\(?\d{1,2}\)?[\s-]?\d{3,4}[\s-]?\d{4}$/;
function runChecks(M,d){
  const out=[];const add=(l,t)=>out.push({l,t});
  const ph=d.preset==='ph';
  let c=0;
  if(!M.name){add('bad','Add your name.');c++;}
  if(!(d.email||'').trim()){add('bad','Add an email address.');c++;}
  else if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email.trim())){add('bad','Email address looks invalid.');c++;}
  const phn=(d.phone||'').trim();
  if(!phn){add('warn','Add a mobile number; ATS contact fields expect one.');c++;}
  else if(ph&&!(PH_MOBILE.test(phn)||PH_LAND.test(phn))){add('warn','Use +63 9XX XXX XXXX for mobile (or include the area code for a landline).');c++;}
  if(ph&&!(d.address||'').trim()){add('warn','Add your address (barangay, city, province, ZIP). Employers in the Philippines usually expect it.');c++;}
  if(!c)add('ok','Contact details complete (plain text, no icons).');
  const has=id=>M.sections.some(s=>s.id===id);
  if(!has('education'))add('bad','Education is empty.');
  else if(!ph){const f=M.sections.find(s=>s.id!=='objective');add(f&&f.id==='education'?'ok':'warn',f&&f.id==='education'?'Education comes first, as in the Harvard format.':'Harvard format puts Education first for students and recent graduates.');}
  if(!has('experience'))add('warn','No Experience entries yet.');
  const work=[];M.sections.forEach(s=>{if(s.id==='experience'||s.id==='leadership')s.entries.forEach(e=>e.bullets.forEach(b=>work.push(b)));});
  if(work.length){
    const weak=work.filter(b=>WEAK.test(b)||/^[a-z]/.test(b)).length;
    add(weak?'warn':'ok',weak?`${weak} bullet(s) open weakly (pronouns, "responsible for", "worked on", lowercase). Start with an action verb such as Led, Built, Processed.`:'All bullets open with a strong, capitalized start.');
    const long=work.filter(b=>b.length>240).length;
    add(long?'warn':'ok',long?`${long} bullet(s) are over about two lines. Tighten them.`:'Bullets are a readable length.');
    const num=work.filter(b=>/\d/.test(b)).length;
    const low=work.length>=4&&num/work.length<0.3;
    add(low?'warn':'ok',low?`Only ${num} of ${work.length} bullets include a number. Add figures, percentages, or scale where true.`:`${num} of ${work.length} bullets include measurable detail.`);
  }
  const dated=[];M.sections.forEach(s=>{if(s.id==='education'||s.id==='experience')s.entries.forEach(e=>dated.push(e));});
  const noD=dated.filter(e=>!e.dates).length,badD=dated.filter(e=>e.dates&&!/\b(19|20)\d{2}\b|present|current/i.test(e.dates)).length;
  if(noD)add('warn',`${noD} entry(ies) have no dates. ATS uses dates to read your timeline.`);
  else if(badD)add('warn','Some dates have no 4-digit year. Use "Month YYYY – Month YYYY".');
  else if(dated.length)add('ok','Every education and experience entry is dated.');
  const hasPersonal=!!(d.dob||d.civil||d.citizen);
  if(ph&&!hasPersonal)add('warn','Optional: many Philippine employers expect date of birth, civil status and citizenship.');
  if(!ph&&(hasPersonal||(d.objective||'').trim()||(d.refsMode==='list'&&(d.refs||[]).some(r=>(r.org||'').trim()))))add('ok','Harvard mode hides the objective, personal information and references, as Harvard-style resumes omit them.');
  if(ph&&d.refsMode==='none')add('warn','Consider character references or "References available upon request."');
  let pict=false;try{pict=/\p{Extended_Pictographic}/u.test(JSON.stringify(d));}catch(e){}
  if(pict)add('bad','Emoji or pictographs found. ATS parsers can drop or garble them.');
  if(M.name||M.sections.length){
    const lim=dims().h-144;
    if(contentH>lim)add('bad',`Runs about ${Math.ceil((contentH-lim)/17)} line(s) past one page. One page is the norm for students and early-career applicants: trim older or weaker bullets.`);
    else add('ok','Fits on one page.');
  }
  return out;
}
function renderChecks(M){drawChecks('#checks',runChecks(M,S),'#chipR');}

/* ---------- exports ---------- */
function toText(M){
  const L=[];L.push((M.name||'').toUpperCase());if(M.contact.length)L.push(M.contact.join(' | '));
  M.sections.forEach(s=>{L.push('',s.title.toUpperCase());
    if(s.entries)s.entries.forEach(e=>{const a=[e.org,e.loc].filter(Boolean).join(', ');if(a)L.push(a);const b=[e.title,e.dates].filter(Boolean).join(' | ');if(b)L.push(b);e.bullets.forEach(x=>L.push('- '+x));});
    if(s.skills)s.skills.forEach(k=>L.push((k.label?k.label+': ':'')+k.items));});
  (M.footer||[]).forEach(t=>L.push('',t));
  return L.join('\n')+'\n';
}
const X=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const run=(t,o)=>{o=o||{};return `<w:r><w:rPr>${o.b?'<w:b/>':''}${o.i?'<w:i/>':''}${o.sz?`<w:sz w:val="${o.sz}"/><w:szCs w:val="${o.sz}"/>`:''}</w:rPr><w:t xml:space="preserve">${X(t)}</w:t></w:r>`;};
const TAB='<w:r><w:tab/></w:r>';
let TABPOS=10080;
const para=(inner,o)=>{o=o||{};return `<w:p><w:pPr>${o.keep?'<w:keepNext/>':''}${o.num?'<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>':''}${o.border?'<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="000000"/></w:pBdr>':''}${o.tabs?`<w:tabs><w:tab w:val="right" w:pos="${TABPOS}"/></w:tabs>`:''}<w:spacing w:before="${o.before||0}" w:after="${o.after||0}"/>${o.jc?`<w:jc w:val="${o.jc}"/>`:''}</w:pPr>${inner}</w:p>`;};
function docBody(M){
  let b=para(run(M.name||'Your Name',{b:1,sz:28}),{jc:'center'});
  if(M.contact.length)b+=para(run(M.contact.join(' | '),{sz:20}),{jc:'center'});
  M.sections.forEach(s=>{
    b+=para(run(s.title.toUpperCase(),{b:1}),{border:1,keep:1,before:160,after:40});
    if(s.entries)s.entries.forEach(e=>{
      const r2=e.title||e.dates;
      if(e.org||e.loc)b+=para(run(e.org,{b:1})+TAB+run(e.loc),{tabs:1,before:80,keep:!!(r2||e.bullets.length)});
      if(r2)b+=para(run(e.title,{i:1})+TAB+run(e.dates),{tabs:1,before:(e.org||e.loc)?0:80,keep:!!e.bullets.length});
      e.bullets.forEach(t=>{b+=para(run(t),{num:1});});
    });
    if(s.skills)s.skills.forEach(k=>{b+=para((k.label?run(k.label+': ',{b:1}):'')+run(k.items),{before:20});});
  });
  (M.footer||[]).forEach(t=>{b+=para(run(t,{i:1,sz:20}),{before:160});});
  return b;
}
const NS='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
async function buildDocx(M,bodyXml){
  const D=dims();TABPOS=D.tw-2160;
  const z=new JSZip();
  z.file('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>');
  z.file('_rels/.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  z.file('word/_rels/document.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>');
  z.file('word/styles.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>`);
  z.file('word/numbering.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ${NS}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="360" w:hanging="220"/></w:pPr><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`);
  z.file('word/document.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${bodyXml!==undefined?bodyXml:docBody(M)}<w:sectPr><w:pgSz w:w="${D.tw}" w:h="${D.th}"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`);
  return z.generateAsync({type:'blob',compression:'DEFLATE'});
}

let DL=null;
(async()=>{try{DL=(window.claude&&window.claude.use)?await window.claude.use('downloads'):null;}catch(e){DL=null;}})();
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2800);}
async function saveFile(name,data){
  if(!DL){toast('Downloads are not available in this view. Use Copy text instead.');return;}
  try{await DL.save({filename:name,data:data});toast('Saved '+name);}
  catch(e){if(e&&e.code==='declined')return;toast('Could not save: '+((e&&e.message)||'unknown error'));}
}
const base=()=>((S.name||'').trim().replace(/[^A-Za-z0-9]+/g,'_').replace(/^_|_$/g,'')||'Resume')+'_Resume';

$('#bDocx').onclick=async()=>{
  if(!window.JSZip){toast('The Word export library did not load. Try Download .txt or Copy text.');return;}
  const M=model(S);if(!M.name&&!M.sections.length){toast('Add some content first.');return;}
  try{await saveFile(base()+'.docx',await buildDocx(M));}catch(e){toast('Could not build the .docx file.');}
};
$('#bTxt').onclick=()=>saveFile(base()+'.txt',toText(model(S)));
$('#bCopy').onclick=async()=>{try{await navigator.clipboard.writeText(toText(model(S)));toast('Resume text copied');}catch(e){toast('Copy was blocked in this view.');}};
$('#bSample').onclick=()=>{activeV().data=clone(SAMPLE);syncS();renderForm();refresh();toast('Sample loaded');};
$('#bClear').onclick=()=>{activeV().data=clone(EMPTY);syncS();renderForm();refresh();};

function refresh(){
  if(tab==='resume'){const M=model(S);renderPreview(M);renderChecks(M);}
  saveV();
}

/* ===== Tabs, cover letter & email ===== */
const DK='resume-gen-harvard-ph-v2-docs';
const todayStr=()=>new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
const DEMPTY=()=>({job:{position:'',company:'',recFull:'',recPos:'',compAddr:'',recEmail:'',source:'',pitch:'',desc:''},cover:{date:todayStr(),tone:'formal',hook:'',roleLine:'',achievements:'',skills:'',cert:'',why:''},email:{type:'apply',date:'',keyPoint:'',ref:'',attachCover:'yes',offer:'',target:'',reason:'',refName:'',refRel:'',deadline:'',startDate:'',lastDay:'',declineReason:'',resignNote:''}});
const DSAMPLE=()=>({
  job:{position:'Junior Security Analyst',company:'Sample Cyber Defense Corp.',recFull:'Ms. Ana Reyes',recPos:'Talent Acquisition Manager',compAddr:'12/F Sample Tower, Bonifacio Global City, Taguig City 1634',recEmail:'careers@samplecyberdefense.example',source:'your company careers page',pitch:'I am an entry-level cybersecurity technician with hands-on SOC experience triaging more than 60 alerts per shift.',desc:'Sample Cyber Defense Corp. is hiring a Junior Security Analyst for its 24/7 Security Operations Center in Taguig. Responsibilities: monitor and triage SIEM alerts (Splunk), investigate phishing and malware incidents, escalate according to playbooks, tune detection rules, and document incidents. Requirements: BS in IT, Computer Science or a related field; knowledge of networking (TCP/IP), Windows and Linux; familiarity with MITRE ATT&CK and NIST frameworks; willingness to work shifting schedules. CompTIA Security+ or an equivalent certification is a plus.'},
  cover:{date:todayStr(),tone:'formal',hook:'With a background in network and information security and hands-on experience in a 24/7 security operations center, I am confident I can contribute from my first week.',roleLine:'Junior SOC Analyst at Sample Managed Security Services, Inc.',achievements:'Triaged 60+ alerts per shift in Splunk, escalating confirmed incidents within a 15-minute SLA\nInvestigated phishing and malware cases with playbooks, cutting containment time by 30%\nTuned 25 SIEM detection rules, reducing false positives by 40%',skills:'Splunk, Wireshark, Nmap, Nessus and the NIST Cybersecurity Framework',cert:'pursuing the CompTIA Security+ (SY0-701) certification',why:'I am drawn to Sample Cyber Defense Corp. because of its 24/7 managed detection and response work for Philippine financial institutions. Protecting banks and payment providers is exactly the kind of high-stakes defensive work I want to build my career on, and I would value the chance to learn from your analysts while contributing to your response times and detection quality.'},
  email:{type:'apply',date:'November 17, 2026',keyPoint:'your 24/7 detection and response operations',ref:'',attachCover:'yes',offer:'PHP 35,000 per month',target:'PHP 42,000 per month',reason:'my hands-on SOC experience, my Security+ certification in progress and the rotating-shift schedule the role requires',refName:'Engr. Juan Dela Cruz',refRel:'when I worked under you at Sample Managed Security Services, Inc.',deadline:'December 5',startDate:'January 5, 2027',lastDay:'December 31, 2026',declineReason:'I have accepted another offer that is closer to my long-term goals',resignNote:'Working with the SOC team has been an important part of my growth.'}
});
let D;
try{const raw=localStorage.getItem(DK);D=raw?JSON.parse(raw):DSAMPLE();}catch(e){D=DSAMPLE();}
{const E0=DEMPTY();Object.keys(E0).forEach(k=>{D[k]=Object.assign(E0[k],D[k]||{});});}
const saveDocs=()=>{try{localStorage.setItem(DK,JSON.stringify(D));}catch(e){}};
function setIn(o,path,val){const k=path.split('.');for(let i=0;i<k.length-1;i++)o=o[k[i]];o[k[k.length-1]]=val;}

const GF=(label,path,val,o)=>{o=o||{};const el=o.area?`<textarea data-d="${path}" rows="${o.rows||3}">${esc(val)}</textarea>`:`<input data-d="${path}" value="${esc(val)}" autocomplete="off">`;return `<label class="f ${o.full?'full':''}"><span>${esc(label)}</span>${el}</label>`;};
const GS=(label,path,val,opts,full)=>`<label class="f ${full?'full':''}"><span>${esc(label)}</span><select data-d="${path}">${opts.map(o=>`<option value="${o[0]}"${o[0]===val?' selected':''}>${esc(o[1])}</option>`).join('')}</select></label>`;
const jobCard=()=>`<section class="card"><h2>Job target</h2><p class="hint">Shared by the cover letter and the email. Your name and contact details come from the Resume tab.</p><div class="grid">
  ${GF('Position applied for','job.position',D.job.position,{full:1})}${GF('Company','job.company',D.job.company,{full:1})}
  ${GF('Hiring manager (e.g., Ms. Ana Reyes)','job.recFull',D.job.recFull)}${GF('Their position','job.recPos',D.job.recPos)}
  ${GF('Company address (optional)','job.compAddr',D.job.compAddr,{full:1})}${GF('Recipient email (optional)','job.recEmail',D.job.recEmail,{full:1})}
  ${GF('Where you found the job','job.source',D.job.source,{full:1})}${GF('One-line pitch (used in the email)','job.pitch',D.job.pitch,{area:1,rows:2,full:1})}${GF('Job description (paste the posting; used by AI tailoring, the AI letter and interview prep)','job.desc',D.job.desc,{area:1,rows:5,full:1})}</div></section>`;
function renderCoverForm(){
  const c=D.cover;
  $('#cForm').innerHTML=jobCard()+`<section class="card"><h2>Letter content</h2><div class="grid">
    ${GF('Date','cover.date',c.date)}${GS('Tone','cover.tone',c.tone,[['formal','Formal'],['warm','Warm and enthusiastic']])}
    ${GF('Opening hook (optional, one sentence)','cover.hook',c.hook,{area:1,rows:2,full:1})}
    ${GF('Most recent role (e.g., Junior SOC Analyst at ABC Corp.)','cover.roleLine',c.roleLine,{full:1})}
    ${GF('Key achievements, one per line (2 to 3, each starting with a past-tense verb)','cover.achievements',c.achievements,{area:1,rows:5,full:1})}
    ${GF('Skills and tools to highlight','cover.skills',c.skills,{full:1})}
    ${GF('Certification or learning in progress (optional)','cover.cert',c.cert,{full:1})}
    ${GF('Why this company (one or two sentences)','cover.why',c.why,{area:1,rows:3,full:1})}</div>${(c.aiText||'').trim()?`<div class="grid" style="margin-top:8px">${GF('AI-written letter body (edit freely; blank lines separate paragraphs)','cover.aiText',c.aiText,{area:1,rows:12,full:1})}</div>`:''}<div class="toolbar" style="margin-top:8px"><button id="cAi" class="pri ai-only">Write with AI</button>${(c.aiText||'').trim()?'<button id="cAiOff">Use template text instead</button>':''}</div><div class="status" id="cStatus"></div></section>`;
}
function renderEmailForm(){
  const e=D.email,t=e.type;
  const TYPES=[['apply','Job application'],['followup','Follow-up on an application'],['thanks','Thank-you after an interview'],['negotiate','Salary negotiation (after an offer)'],['reference','Reference request'],['accept','Accept a job offer'],['decline','Decline a job offer'],['resign','Resignation notice']];
  let f='';
  if(t==='apply')f=GF('Job reference no. (optional)','email.ref',e.ref)+GS('Attach cover letter?','email.attachCover',e.attachCover,[['yes','Yes'],['no','No, resume only']]);
  else if(t==='followup')f=GF('Date you applied','email.date',e.date,{full:1});
  else if(t==='thanks')f=GF('Interview date','email.date',e.date)+GF('Something you discussed','email.keyPoint',e.keyPoint);
  else if(t==='negotiate')f=GF('Offered salary (e.g., PHP 35,000 per month)','email.offer',e.offer)+GF('Your target','email.target',e.target)+GF('Why this figure is fair (skills, scope, market)','email.reason',e.reason,{area:1,rows:3,full:1});
  else if(t==='reference')f=GF('Referee (e.g., Engr. Juan Dela Cruz)','email.refName',e.refName)+GF('Needed by (optional)','email.deadline',e.deadline)+GF('How you worked together','email.refRel',e.refRel,{area:1,rows:2,full:1});
  else if(t==='accept')f=GF('Start date','email.startDate',e.startDate)+GF('Confirmed terms (optional)','email.offer',e.offer);
  else if(t==='decline')f=GF('Reason (optional, kept brief)','email.declineReason',e.declineReason,{area:1,rows:2,full:1});
  else if(t==='resign')f=GF('Last working day','email.lastDay',e.lastDay)+GF('Note (optional)','email.resignNote',e.resignNote,{area:1,rows:2,full:1});
  $('#eForm').innerHTML=jobCard()+`<section class="card"><h2>Email details</h2>${t==='resign'?'<p class="hint">For a resignation, enter your current position and employer in the Job target card, and your manager under Hiring manager.</p>':''}${t==='reference'?'<p class="hint">This email goes to the person you are asking, not to the employer.</p>':''}<div class="grid">${GS('Type of email','email.type',t,TYPES,1)}${f}</div></section>`;
}
function onDocField(e){
  const p=e.target.dataset&&e.target.dataset.d;if(!p)return;
  setIn(D,p,e.target.value);
  if(p==='email.type')renderEmailForm();
  refreshActive();saveDocs();
}
['#cForm','#eForm'].forEach(sel=>{$(sel).addEventListener('input',onDocField);$(sel).addEventListener('change',onDocField);});

const lc=t=>t.charAt(0).toLowerCase()+t.slice(1);
const sentence=t=>{t=(t||'').trim();return /[.!?]$/.test(t)?t:t+'.';};
function who(full){const f=(full||'').trim();if(!f)return'';const m=f.match(/^(Mr|Ms|Mrs|Atty|Engr|Dr|Prof)\.?\s/i);const last=f.split(/\s+/).pop();return m?m[1].charAt(0).toUpperCase()+m[1].slice(1).toLowerCase()+'. '+last:f;}
const words=t=>t.split(/\s+/).filter(Boolean).length;
const nm=()=>(S.name||'').trim()||'Your Name';
const contactOr=()=>[S.phone,S.email].map(x=>(x||'').trim()).filter(Boolean).join(' or ');

function coverModel(){
  const j=D.job,c=D.cover,ph=S.preset==='ph',warm=c.tone==='warm';
  const pos=j.position.trim()||'[position]',co=j.company.trim()||'[company]',w=who(j.recFull);
  const paras=[];
  paras.push(`${warm?'I am excited to apply':'I am writing to apply'} for the ${pos} position at ${co}${j.source.trim()?`, which I found through ${j.source.trim()}`:''}. ${c.hook.trim()?sentence(c.hook):''}`.trim());
  const ach=bulletsOf(c.achievements).map(l=>l.replace(/[.\s]+$/,''));
  if(ach.length){const lead=c.roleLine.trim()?`In my role as ${c.roleLine.trim()}, `:'';const conn=['I ','I also ','Additionally, I '];
    paras.push(ach.map((l,i)=>(i===0?lead+'I ':conn[Math.min(i,2)])+lc(l)+'.').join(' '));}
  else if(c.roleLine.trim())paras.push(`I currently serve as ${c.roleLine.trim()}.`);
  const p3=[c.skills.trim()?`I bring hands-on experience with ${c.skills.trim().replace(/[.\s]+$/,'')}.`:'',c.cert.trim()?`I am also ${c.cert.trim().replace(/[.\s]+$/,'')}.`:''].filter(Boolean).join(' ');
  if(p3)paras.push(p3);
  if(c.why.trim())paras.push(sentence(c.why));
  const ct=contactOr();
  paras.push(warm?`Thank you so much for your time. I would love the chance to talk about how I can contribute to ${co}${ct?`, and I can be reached at ${ct}`:''}.`:`Thank you for considering my application. I would welcome the opportunity to discuss how my background can support ${co}${ct?`, and I can be reached at ${ct}`:''}.`);
  const fix=t=>t.replace(/\.\.(?!\.)/g,'.');
  return{sal:ph?`Dear ${w||'Sir/Madam'}:`:`Dear ${w||'Hiring Manager'},`,paras:(((D.cover.aiText||'').trim())?D.cover.aiText.trim().split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean):paras).map(fix),close:ph?'Respectfully yours,':'Sincerely,',rec:[j.recFull,j.recPos,j.company,j.compAddr].map(x=>x.trim()).filter(Boolean),date:c.date.trim()};
}
function coverHTML(L){
  const M=model(S);let h=`<div class="r-name">${esc(nm())}</div>`;
  if(M.contact.length)h+=`<div class="r-contact">${M.contact.map(esc).join(' &nbsp;|&nbsp; ')}</div>`;
  if(L.date)h+=`<div class="l-date">${esc(L.date)}</div>`;
  if(L.rec.length)h+=`<div class="l-rec">${L.rec.map(esc).join('<br>')}</div>`;
  h+=`<div class="l-sal">${esc(L.sal)}</div>`+L.paras.map(t=>`<div class="l-p">${esc(t)}</div>`).join('')+`<div class="l-close">${esc(L.close)}</div><div class="l-sig">${esc(nm())}</div>`;
  return h;
}
function coverText(L){
  const M=model(S);const o=[nm()];if(M.contact.length)o.push(M.contact.join(' | '));
  if(L.date)o.push('',L.date);if(L.rec.length)o.push('',...L.rec);
  o.push('',L.sal);L.paras.forEach(t=>o.push('',t));o.push('',L.close,'',nm());return o.join('\n')+'\n';
}
function coverDoc(L){
  const M=model(S);let b=para(run(nm(),{b:1,sz:28}),{jc:'center'});
  if(M.contact.length)b+=para(run(M.contact.join(' | '),{sz:20}),{jc:'center'});
  if(L.date)b+=para(run(L.date),{before:240});
  L.rec.forEach((t,i)=>{b+=para(run(t),{before:i===0?240:0});});
  b+=para(run(L.sal),{before:240});
  L.paras.forEach(t=>{b+=para(run(t),{before:160});});
  b+=para(run(L.close),{before:240});b+=para(run(nm()),{before:480});return b;
}
function fit(ids){
  const D_=dims(),paper=$(ids.paper),stage=$(ids.stage),scaler=$(ids.scaler),h=$(ids.body).offsetHeight;
  if(!stage.clientWidth)return h;
  const s=Math.min(1,(stage.clientWidth-24)/D_.w),full=Math.max(D_.h,h+144);
  paper.style.width=D_.w+'px';paper.style.minHeight=D_.h+'px';paper.style.height=full+'px';paper.style.transform='scale('+s+')';
  scaler.style.width=(D_.w*s)+'px';scaler.style.height=(full*s)+'px';
  const pg=$(ids.pg);pg.style.top=(D_.h-72)+'px';pg.className='pgline'+(h>D_.h-144?' over':'');
  return h;
}
function drawChecks(sel,arr,chip){
  const li=x=>`<li><span class="dot ${x.l}" aria-hidden="true">${x.l==='ok'?'&#10003;':'!'}</span><span>${esc(x.t)}</span></li>`;
  const bad=arr.filter(x=>x.l!=='ok'),ok=arr.filter(x=>x.l==='ok');
  $(sel).innerHTML=(bad.length?`<ul>${bad.map(li).join('')}</ul>`:`<p class="okline"><span class="dot ok" aria-hidden="true">&#10003;</span><span>All ${ok.length} checks passed.</span></p>`)
    +(ok.length&&bad.length?`<details><summary>${ok.length} passed</summary><ul>${ok.map(li).join('')}</ul></details>`:(ok.length?`<details><summary>Show checks</summary><ul>${ok.map(li).join('')}</ul></details>`:''));
  if(chip&&$(chip)){const pg=arr.find(x=>/one page|past one page/i.test(x.t)),c=$(chip);
    if(!pg){c.className='chip';c.textContent=bad.length?bad.length+' to fix':'Ready';}
    else{const over=pg.l!=='ok';c.className='chip '+(over?'bad':(bad.length?'warn':'ok'));c.textContent=over?(pg.t.match(/about (\d+) line/i)?'Over by '+pg.t.match(/about (\d+) line/i)[1]+' line(s)':'Over one page'):(bad.length?bad.length+' to fix':'Fits one page');}}
}
function coverChecks(L,h){
  const out=[],add=(l,t)=>out.push({l:l,t:t}),j=D.job,all=L.paras.join(' ');
  if(!(S.name||'').trim()||!(S.email||'').trim())add('bad','Add your name and email on the Resume tab; the letter header uses them.');
  if(!j.position.trim()||!j.company.trim())add('bad','Add the position and company so the letter names them.');else add('ok','Position and company are named.');
  if(/\[[^\]]+\]/.test(all))add('bad','Unfilled [placeholders] remain in the letter.');
  const wc=words(all);
  add(wc<200||wc>400?'warn':'ok',wc<200?`About ${wc} words. Aim for 250 to 400 so it reads as a full letter.`:wc>400?`About ${wc} words. Trim toward 400 or fewer so it stays on one page.`:`About ${wc} words, a good length.`);
  add(j.recFull.trim()?'ok':'warn',j.recFull.trim()?'Addressed to a named person.':'No named recipient. Check the job post, LinkedIn or the company site; a named contact is stronger than a generic greeting.');
  const ach=bulletsOf(D.cover.achievements);
  add(ach.length<2?'warn':'ok',ach.length<2?'Add two or three achievements so the letter proves your fit.':(ach.some(a=>/\d/.test(a))?'Achievements include measurable results.':'Add a number or result to at least one achievement.'));
  const lim=dims().h-144;
  add(h>lim?'bad':'ok',h>lim?`Runs about ${Math.ceil((h-lim)/17)} line(s) past one page. Shorten a paragraph.`:'Fits on one page.');
  return out;
}
function refreshCover(){const L=coverModel();$('#cBody').innerHTML=coverHTML(L);const h=fit({paper:'#cPaper',stage:'#cStage',scaler:'#cScaler',body:'#cBody',pg:'#cPg'});drawChecks('#cChecks',coverChecks(L,h),'#chipC');}

function emailModel(){
  const j=D.job,e=D.email,ph=S.preset==='ph',t=e.type,name=nm();
  const pos=j.position.trim()||'[position]',co=j.company.trim()||'[company]';
  const w=who(t==='reference'?e.refName:j.recFull);
  const sal=ph?`Good day, ${w||(t==='reference'?'[referee name]':"Ma'am/Sir")},`:`Dear ${w||(t==='reference'?'[referee name]':'Hiring Manager')},`;
  const ct=[S.phone,S.email].map(x=>(x||'').trim()).filter(Boolean).join(' | ');
  const stem=name.replace(/[^A-Za-z0-9]+/g,'_').replace(/^_|_$/g,'')||'Name';
  const strip=x=>(x||'').trim().replace(/[.\s]+$/,'');
  let subject,mid,att='',to=j.recEmail.trim()||'[recipient email]';
  if(t==='followup'){
    subject=`Following up: ${pos} application - ${name}`;
    mid=`I hope you are well. I am following up on my application for the ${pos} position at ${co}${e.date.trim()?`, which I submitted on ${e.date.trim()}`:''}. I remain very interested in the role and would be glad to provide any additional information you may need.\n\nThank you for your time and consideration.`;
  }else if(t==='thanks'){
    subject=`Thank you for the interview - ${pos}`;
    mid=`Thank you for taking the time to speak with me${e.date.trim()?` on ${e.date.trim()}`:''} about the ${pos} position at ${co}. ${e.keyPoint.trim()?`I especially enjoyed learning about ${strip(e.keyPoint)}. `:''}Our conversation strengthened my interest in the role and in contributing to your team. Please let me know if I can provide any further information.\n\nThank you again for your time and consideration.`;
  }else if(t==='negotiate'){
    subject=`Regarding the ${pos} offer - ${name}`;
    mid=`Thank you again for offering me the ${pos} position at ${co}. I am excited about the opportunity and about contributing to your team.\n\n${e.offer.trim()?`I appreciate the offer of ${strip(e.offer)}. `:''}Based on ${strip(e.reason)||'my skills, experience and the scope of the role'}, I would like to ask whether there is flexibility to adjust the compensation to ${strip(e.target)||'[target amount]'}.\n\nI remain very enthusiastic about joining ${co} and would be glad to discuss this at your convenience.\n\nThank you for your consideration.`;
  }else if(t==='reference'){
    to='[referee email]';subject=`Reference request - ${name}`;
    mid=`I hope you are well. I am applying for the ${pos} position at ${co}, and I would be grateful if you would be willing to serve as a reference for me${e.refRel.trim()?`, given our work together ${strip(e.refRel)}`:''}.\n\nI can send you my updated resume and the job description so you know what the role needs. ${e.deadline.trim()?`The employer may contact you by ${strip(e.deadline)}. `:''}Please let me know if you are comfortable with this, or if you would prefer that I ask someone else.\n\nThank you very much for your time and support.`;
  }else if(t==='accept'){
    subject=`Acceptance of ${pos} offer - ${name}`;
    mid=`Thank you for offering me the ${pos} position at ${co}. I am pleased to formally accept the offer${e.offer.trim()?` on the terms we discussed (${strip(e.offer)})`:''}.\n\n${e.startDate.trim()?`I confirm my start date of ${strip(e.startDate)}. `:''}Please let me know the onboarding requirements and any documents I should prepare before my first day.\n\nI am looking forward to joining the team.`;
  }else if(t==='decline'){
    subject=`Regarding the ${pos} offer - ${name}`;
    mid=`Thank you for offering me the ${pos} position at ${co}, and for the time you and your team invested in me during the process.\n\nAfter careful consideration, I have decided to decline the offer${e.declineReason.trim()?` because ${strip(e.declineReason)}`:''}. This was not an easy decision, as I was impressed by ${co}.\n\nI hope our paths cross again, and I wish you and the team continued success.`;
  }else if(t==='resign'){
    subject=`Resignation - ${name}`;
    mid=`Please accept this email as my formal resignation from my position as ${pos} at ${co}, effective ${strip(e.lastDay)||'[last working day]'}.\n\nI am grateful for the opportunities and support I received during my time here. ${e.resignNote.trim()?sentence(e.resignNote)+' ':''}I will do my best to ensure a smooth handover and am happy to help train my replacement or document my ongoing work before I leave.\n\nThank you for your understanding.`;
  }else{
    subject=`Application for ${pos}${e.ref.trim()?` (Ref: ${e.ref.trim()})`:''} - ${name}`;
    const a=e.attachCover==='yes';
    mid=`I am writing to apply for the ${pos} position at ${co}${j.source.trim()?`, which I found through ${j.source.trim()}`:''}. ${j.pitch.trim()?sentence(j.pitch):''}\n\nI have attached my resume${a?' and cover letter':''} for your review. I would welcome the chance to discuss how I can contribute to ${co}.\n\nThank you for your time and consideration.`.replace(/ \n/g,'\n');
    att=`\n\nAttachments: ${stem}_Resume.docx${a?`, ${stem}_Cover_Letter.docx`:''}`;
  }
  mid=mid.replace(/\.\.(?!\.)/g,'.');
  return{to:to,subject:subject,body:`${sal}\n\n${mid}\n\nBest regards,\n${name}${ct?`\n${ct}`:''}${att}`};
}
function emailText(m){return `To: ${m.to}\nSubject: ${m.subject}\n\n${m.body}\n`;}
function refreshEmail(){
  const m=emailModel();
  $('#eOut').innerHTML=`<div class="mail"><div class="mrow"><b>To:</b> ${esc(m.to)}</div><div class="mrow"><b>Subject:</b> ${esc(m.subject)}</div><div class="mbody">${esc(m.body)}</div></div>`;
  const out=[],add=(l,t)=>out.push({l:l,t:t});
  if(/\[[^\]]+\]/.test(m.subject+m.body))add('bad','Unfilled [placeholders] remain. Fill in the job target fields.');
  if(!(S.name||'').trim()||!(S.email||'').trim())add('bad','Add your name and email on the Resume tab.');
  add(m.subject.length<=80?'ok':'warn',m.subject.length<=80?'Subject is clear and short enough to read in full in an inbox.':'Subject is long and may be cut off. Shorten it.');
  const wc=words(m.body);add(wc>200?'warn':'ok',wc>200?`About ${wc} words. Keep recruiter emails short.`:`About ${wc} words, a good length.`);
  add(D.job.recFull.trim()?'ok':'warn',D.job.recFull.trim()?'Addressed to a named person.':'No named recipient. A named contact is stronger than a generic greeting.');
  const ty=D.email.type;
  if(ty==='apply')add('ok','Remember to attach your files with the names shown at the bottom (PDF or .docx).');
  if(ty==='resign'&&S.preset==='ph')add('warn','Philippine employees usually give 30 days of written notice. Confirm the notice period in your contract before you send this.');
  if(ty==='negotiate')add('warn','Research the market range first and keep the tone appreciative. Send this only after you have a written offer.');
  if(ty==='reference')add('warn','Ask for permission before you list someone as a reference, and give them time to reply.');
  drawChecks('#eChecks',out);
}

async function copyText(t,msg){try{await navigator.clipboard.writeText(t);toast(msg);}catch(e){toast('Copy was blocked in this view.');}}
$('#cCopy').onclick=()=>copyText(coverText(coverModel()),'Cover letter copied');
$('#cTxt').onclick=()=>saveFile(base().replace(/_Resume$/,'')+'_Cover_Letter.txt',coverText(coverModel()));
$('#cDocx').onclick=async()=>{
  if(!window.JSZip){toast('The Word export library did not load. Try Download .txt or Copy text.');return;}
  try{await saveFile(base().replace(/_Resume$/,'')+'_Cover_Letter.docx',await buildDocx(null,coverDoc(coverModel())));}catch(e){toast('Could not build the .docx file.');}
};
$('#eCopySub').onclick=()=>copyText(emailModel().subject,'Subject copied');
$('#eCopyBody').onclick=()=>copyText(emailModel().body,'Body copied');
$('#eCopyAll').onclick=()=>copyText(emailText(emailModel()),'Email copied');
$('#eTxt').onclick=()=>saveFile(base().replace(/_Resume$/,'')+'_Email.txt',emailText(emailModel()));
const loadDocSample=()=>{D=DSAMPLE();renderCoverForm();renderEmailForm();refreshActive();saveDocs();toast('Sample loaded');};
const clearDocs=()=>{D=DEMPTY();renderCoverForm();renderEmailForm();refreshActive();saveDocs();};
$('#cSample').onclick=loadDocSample;$('#eSample').onclick=loadDocSample;$('#cClear').onclick=clearDocs;$('#eClear').onclick=clearDocs;

/* ===== UI: menus, accordions, mobile view toggle ===== */
function closeMenus(except){document.querySelectorAll('.menu .pop').forEach(p=>{if(p!==except){p.hidden=true;const b=p.previousElementSibling;if(b)b.setAttribute('aria-expanded','false');}});}
document.addEventListener('click',e=>{
  const mb=e.target.closest('[data-menu]');
  if(mb){const pop=mb.nextElementSibling,open=pop.hidden;closeMenus(pop);pop.hidden=!open;mb.setAttribute('aria-expanded',String(open));return;}
  if(e.target.closest('.pop button')){closeMenus();return;}
  if(!e.target.closest('.menu'))closeMenus();
  const vb=e.target.closest('.mtoggle button');
  if(vb){const m=vb.closest('main');m.dataset.view=vb.dataset.view;m.querySelectorAll('.mtoggle button').forEach(b=>b.setAttribute('aria-pressed',String(b===vb)));refreshActive();window.scrollTo(0,0);}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=document.querySelector('.menu .pop:not([hidden])');if(o){const b=o.previousElementSibling;closeMenus();if(b)b.focus();}}});
const OPEN={};
document.addEventListener('toggle',e=>{const d=e.target;if(d.classList&&d.classList.contains('acc')&&d.dataset.key)OPEN[d.dataset.key]=d.open;},true);
function tidy(root){
  root.querySelectorAll(':scope>section.card').forEach((sec,idx)=>{
    const h=sec.querySelector(':scope>h2');if(!h)return;
    const title=h.textContent,key=root.id+'|'+title;
    const det=document.createElement('details');det.className='acc';det.dataset.key=key;
    det.open=key in OPEN?OPEN[key]:(root.id==='form'?title==='Contact':root.id==='iForm'?idx<2:true);
    const sum=document.createElement('summary');sum.textContent=title;
    const n=sec.querySelectorAll(':scope>.entry').length;
    if(n){const m=document.createElement('span');m.className='meta';m.textContent=n;sum.appendChild(m);}
    const body=document.createElement('div');body.className='body';
    h.remove();while(sec.firstChild)body.appendChild(sec.firstChild);
    det.append(sum,body);sec.replaceWith(det);
  });
}
const TIDY=['form','cForm','eForm','iForm','pForm','iSide','pSide'];
const mo=new MutationObserver(()=>TIDY.forEach(id=>{const r=document.getElementById(id);if(r&&r.querySelector(':scope>section.card'))tidy(r);}));
TIDY.forEach(id=>mo.observe(document.getElementById(id),{childList:true}));

let tab='resume';
const PANES={resume:'#paneResume',cover:'#paneCover',email:'#paneEmail',tracker:'#paneTracker',interview:'#paneInterview',ph:'#panePh'};
function refreshActive(){
  if(tab==='cover')refreshCover();else if(tab==='email')refreshEmail();
  else if(tab==='tracker')renderTracker();else if(tab==='interview')renderInterview();else if(tab==='ph')renderPhSide();
  else{const M=model(S);renderPreview(M);renderChecks(M);}
}
function showTab(t,fromHash){
  if(!PANES[t])t='resume';tab=t;
  stopPractice();
  Object.keys(PANES).forEach(k=>{$(PANES[k]).hidden=k!==t;});
  document.querySelectorAll('#tabs button').forEach(b=>{if(b.dataset.tab===t)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  closeMenus();
  if(t==='cover')renderCoverForm();if(t==='email')renderEmailForm();if(t==='interview')renderInterviewForm();if(t==='ph')renderPhForm();
  refreshActive();
  if(!fromHash){try{location.hash=t;}catch(e){}}
}
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-tab]');if(b){showTab(b.dataset.tab);window.scrollTo(0,0);}});
window.addEventListener('hashchange',()=>showTab((location.hash||'').replace('#',''),true));
function initTabs(){const h=(location.hash||'').replace('#','');if(PANES[h]&&h!=='resume')showTab(h,true);}


/* ===== Versions, AI, PDF, import ===== */
const vCard=()=>`<section class="card"><h2>Version &amp; format</h2><div class="grid">
  <label class="f"><span>Active version</span><select id="vSel">${V.list.map(v=>`<option value="${v.id}"${v.id===V.active?' selected':''}>${esc(v.name)}</option>`).join('')}</select></label>
  <label class="f"><span>Version name</span><input id="vName" value="${esc(activeV().name)}" autocomplete="off"></label></div>
  <div class="toolbar"><button data-v="new">New blank</button><button data-v="dup">Duplicate</button><button data-v="del">Delete</button></div>
  <p class="hint">Keep one version per kind of job. Everything below edits the active version.</p>
  <div class="grid">
    ${SEL('Checklist style','preset',S.preset,[['ph','Philippine resume'],['us','Harvard / US']],1)}
    ${SEL('Paper size','paper',S.paper,[['letter','Letter / short bond (8.5 x 11 in)'],['a4','A4']])}
    ${S.preset==='us'?'':SEL('Section order','order',S.order,[['edu','Education first (students, fresh grads)'],['exp','Experience first (experienced)']])}${S.preset==='us'?'':SEL('Declaration line at the end','declaration',S.declaration,[['none','None'],['certify','"True and correct" statement'],['consent','Statement + data privacy consent']],1)}</div></section>`;
const aiCards=()=>`<section class="card"><h2>Tailor &amp; import</h2>
  <p class="hint">Paste a job posting and Claude rewrites your objective, bullets and skills order to match it without inventing facts. The result is saved as a new version, so your original stays safe.</p>
  ${GF('Job description','job.desc',D.job.desc,{area:1,rows:5,full:1})}
  <div class="toolbar"><button id="bTailor" class="pri ai-only">Tailor to this job</button></div><div class="status" id="tailorStatus"></div>
  <p class="hint">Or import an existing resume (.docx, text-based PDF or .txt). It is read in your browser and organized into the fields below as a new version.</p>
  <div class="toolbar"><button id="bImportPick">Import file</button></div><div class="status" id="importStatus"></div></section>`;
function addVersion(v){V.list.push(v);V.active=v.id;syncS();renderForm();refresh();saveV();}
let delArm=0;
$('#form').addEventListener('click',e=>{
  const b=e.target.closest('[data-v]');
  if(b){
    const act=b.dataset.v;
    if(act==='new'){const d=norm(clone(EMPTY));d.preset=S.preset;d.paper=S.paper;addVersion({id:uid(),name:'Untitled '+(V.list.length+1),data:d});}
    else if(act==='dup')addVersion({id:uid(),name:activeV().name+' (copy)',data:clone(S)});
    else if(act==='del'){
      if(V.list.length<2){toast('Keep at least one version.');return;}
      if(Date.now()-delArm<3000){V.list=V.list.filter(v=>v.id!==V.active);V.active=V.list[0].id;syncS();renderForm();refresh();saveV();toast('Version deleted');}
      else{delArm=Date.now();toast('Click Delete again within 3 seconds to confirm');}
    }
    return;
  }
  if(e.target.id==='bTailor')tailor();
  if(e.target.id==='bImportPick')$('#fImport').click();
});
$('#form').addEventListener('change',e=>{if(e.target.id==='vSel'){V.active=e.target.value;syncS();renderForm();refresh();saveV();}});
$('#form').addEventListener('input',e=>{if(e.target.id==='vName'){activeV().name=e.target.value||'Untitled';const o=$('#vSel option:checked');if(o)o.textContent=activeV().name;saveV();}});
$('#fImport').addEventListener('change',e=>{const f=e.target.files[0];e.target.value='';if(f)importFile(f);});

/* AI helper */
let AI;
(async()=>{try{AI=(window.claude&&window.claude.use)?await window.claude.use('sample'):null;}catch(e){AI=null;}
  if(!AI)document.querySelectorAll('.ai-only').forEach(el=>{el.hidden=true;});})();
function aiErr(e){const c=e&&e.code;
  return c==='not_granted'?'Claude access was not allowed for this page.':c==='rate_limited'?'Too many requests right now. Try again in a minute.':c==='cancelled'?'':c==='invalid_json'?'The AI reply could not be read. Try again.':c==='sampling_disabled'?'Claude is not available for this account.':'The AI request failed ('+(c||'unknown error')+'). Try again.';}
async function askJSON(prompt,statusSel){
  if(!AI){setStatus(statusSel,'AI is not available in this view.');return null;}
  setStatus(statusSel,'Thinking... this can take up to a minute.');
  try{const v=await AI.json(prompt,{cache:false});setStatus(statusSel,'');return v;}
  catch(e){setStatus(statusSel,aiErr(e));return null;}
}
const nums=t=>(String(t).match(/\d[\d,.]*%?/g)||[]).map(x=>x.replace(/[,.]+$/,''));
function tailor(){
  return (async()=>{
    const st='#tailorStatus';
    if(!(D.job.desc||'').trim()){setStatus(st,'Paste the job description first.');return;}
    const entry=e=>({org:e.org,title:e.title,bullets:bulletsOf(e.bullets)});
    const payload={objective:S.objective,experience:S.experience.map(entry),leadership:S.leadership.map(entry),skills:S.skills.map(k=>({label:k.label,items:k.items}))};
    const prompt=`You are an expert resume editor helping a job seeker tailor a resume to a job posting.

RULES (strict):
- Use ONLY facts already in the resume. Never invent employers, titles, tools, certifications, numbers, dates or results. Keep every number exactly as written.
- Rewrite bullets so wording and keywords match the posting where the resume truthfully supports them. Start each bullet with a strong past-tense action verb (present tense for a current role). Keep each bullet under 200 characters. You may reorder bullets so the most relevant come first. Keep the same number of entries in the same order; use the same number of bullets or fewer.
- For skills: keep the same rows and labels. You may reorder items inside a row so the most relevant come first. Do NOT add any skill that is not already in the resume.
- Objective: if the resume has one, rewrite it in at most 20 words for this job. If it is empty, return an empty string.
- Plain text only, no markdown.

Reply with ONLY this JSON:
{"objective":string,"experience":[{"bullets":[string]}],"leadership":[{"bullets":[string]}],"skills":[{"items":string}],"notes":[string]}
"notes" are up to 5 short notes on what you changed and why.

JOB TARGET: ${D.job.position||''} at ${D.job.company||''}
JOB POSTING:
${D.job.desc.slice(0,9000)}

RESUME (JSON):
${JSON.stringify(payload)}`;
    const r=await askJSON(prompt,st);
    if(!r)return;
    const nd=clone(S);let skipped=0;
    if(typeof r.objective==='string'&&r.objective.trim()&&S.objective.trim())nd.objective=r.objective.trim();
    ['experience','leadership'].forEach(k=>{
      if(!Array.isArray(r[k]))return;
      r[k].forEach((x,i)=>{
        if(!nd[k][i]||!x||!Array.isArray(x.bullets)||!x.bullets.length)return;
        const orig=new Set(nums(nd[k][i].bullets)),nb=x.bullets.map(String).filter(t=>t.trim());
        if(nums(nb.join(' ')).every(n=>orig.has(n))&&nb.length<=Math.max(bulletsOf(nd[k][i].bullets).length,1))nd[k][i].bullets=nb.join('\n');else skipped++;
      });
    });
    if(Array.isArray(r.skills)){
      const allowed=new Set();S.skills.forEach(k=>k.items.split(',').forEach(t=>allowed.add(t.trim().toLowerCase())));
      r.skills.forEach((x,i)=>{if(!nd.skills[i]||!x||typeof x.items!=='string')return;
        const toks=x.items.split(',').map(t=>t.trim()).filter(Boolean);
        if(toks.length&&toks.every(t=>allowed.has(t.toLowerCase())))nd.skills[i].items=toks.join(', ');else skipped++;});
    }
    const name='Tailored - '+((D.job.company||D.job.position||'job').trim());
    addVersion({id:uid(),name:name,data:nd});
    const notes=Array.isArray(r.notes)?r.notes.slice(0,5).map(n=>'- '+String(n)).join('\n'):'';
    setStatus('#tailorStatus','Saved as a new version: "'+name+'". Review every line before you send it.'+(skipped?'\n'+skipped+' rewrite(s) were rejected because they changed numbers or skills, so the original wording was kept there.':'')+(notes?'\n'+notes:''));
  })();
}

/* library loader (PDF export, PDF import) */
const LIBS={jspdf:'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',pdfjs:'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',pdfworker:'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'};
const loadedLibs={};
function loadLib(url){return loadedLibs[url]||(loadedLibs[url]=new Promise((res,rej)=>{const el=document.createElement('script');el.src=url;el.onload=res;el.onerror=()=>{delete loadedLibs[url];rej(new Error('Could not load a required library. Check your connection.'));};document.head.appendChild(el);}));}

/* PDF writer: real selectable text, standard Times font, one column */
function newPdf(){
  const J=window.jspdf.jsPDF,a4=S.paper==='a4',doc=new J({unit:'pt',format:a4?'a4':'letter'});
  const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight(),m=54,cw=W-2*m;let y=m;
  const lh=z=>z*1.15,F=(st,z)=>{doc.setFont('times',st);doc.setFontSize(z);},clean=t=>String(t==null?'':t);
  const room=h=>{if(y+h>H-m){doc.addPage();y=m;}};
  return{
    center(t,z,st){F(st,z);doc.splitTextToSize(clean(t),cw).forEach(l=>{room(lh(z));doc.text(l,W/2,y+z*.92,{align:'center'});y+=lh(z);});},
    gap(n){y+=n;},
    heading(t){y+=8;room(lh(11)+6);F('bold',11);doc.text(clean(t),m,y+11*.92);y+=lh(11);doc.setLineWidth(.5);doc.line(m,y+.5,W-m,y+.5);y+=3;},
    row(l,r,st){
      F('normal',11);const rw=r?doc.getTextWidth(clean(r)):0;F(st,11);
      const lines=doc.splitTextToSize(clean(l),cw-(rw?rw+12:0));
      if(!lines.length)lines.push('');
      lines.forEach((ln,i)=>{room(lh(11));F(st,11);doc.text(ln,m,y+11*.92);if(i===0&&r){F('normal',11);doc.text(clean(r),W-m,y+11*.92,{align:'right'});}y+=lh(11);});
    },
    bullet(t){F('normal',11);doc.splitTextToSize(clean(t),cw-18).forEach((ln,i)=>{room(lh(11));if(i===0)doc.text('•',m+7,y+11*.92);doc.text(ln,m+18,y+11*.92);y+=lh(11);});},
    labeled(label,items){
      F('bold',11);const lab=label?label+': ':'',lw=lab?doc.getTextWidth(lab):0;F('normal',11);
      const words=clean(items).split(/\s+/).filter(Boolean),lines=[];let cur='',avail=cw-lw;
      words.forEach(w=>{const t=cur?cur+' '+w:w;if(!cur||doc.getTextWidth(t)<=avail)cur=t;else{lines.push(cur);cur=w;avail=cw;}});
      if(cur)lines.push(cur);
      lines.forEach((ln,i)=>{room(lh(11));if(i===0&&lab){F('bold',11);doc.text(lab,m,y+11*.92);F('normal',11);doc.text(ln,m+lw,y+11*.92);}else{F('normal',11);doc.text(ln,m,y+11*.92);}y+=lh(11);});
      y+=1;
    },
    para(t,o){o=o||{};const z=o.sz||11;y+=o.before||0;F(o.st||'normal',z);doc.splitTextToSize(clean(t),cw).forEach(ln=>{room(lh(z));doc.text(ln,m,y+z*.92);y+=lh(z);});},
    finish(title){doc.setProperties({title:title});return doc.output('blob');}
  };
}
function resumePdf(M){
  const w=newPdf();w.center(M.name||'Your Name',14,'bold');if(M.contact.length)w.center(M.contact.join(' | '),10,'normal');
  M.sections.forEach(s=>{w.heading(s.title.toUpperCase());
    if(s.entries)s.entries.forEach(e=>{w.gap(4);if(e.org||e.loc)w.row(e.org,e.loc,'bold');if(e.title||e.dates)w.row(e.title,e.dates,'italic');e.bullets.forEach(b=>w.bullet(b));});
    if(s.skills)s.skills.forEach(k=>w.labeled(k.label,k.items));});
  (M.footer||[]).forEach(t=>w.para(t,{sz:10,st:'italic',before:8}));
  return w.finish((M.name||'Resume')+' - Resume');
}
async function pdfDownload(kind){
  try{await loadLib(LIBS.jspdf);}catch(e){toast(e.message);return;}
  const stem=base().replace(/_Resume$/,'');
  try{
    if(kind==='cover')await saveFile(stem+'_Cover_Letter.pdf',coverPdf(coverModel()));
    else{const M=model(S);if(!M.name&&!M.sections.length){toast('Add some content first.');return;}await saveFile(stem+'_Resume.pdf',resumePdf(M));}
  }catch(e){toast('Could not build the PDF.');}
}
$('#bPdf').onclick=()=>pdfDownload('resume');

/* resume import */
function docxXmlToText(xml){
  const d=new DOMParser().parseFromString(xml,'application/xml'),out=[];
  Array.from(d.getElementsByTagNameNS('*','p')).forEach(p=>{let t='';
    Array.from(p.getElementsByTagNameNS('*','*')).forEach(n=>{const ln=n.localName;if(ln==='t')t+=n.textContent;else if(ln==='tab')t+='\t';else if(ln==='br')t+='\n';});
    out.push(t);});
  return out.join('\n');
}
async function extractText(f){
  const n=f.name.toLowerCase();
  if(n.endsWith('.txt'))return await f.text();
  if(n.endsWith('.docx')){
    if(!window.JSZip)throw new Error('The Word reader library did not load.');
    const z=await JSZip.loadAsync(await f.arrayBuffer()),part=z.file('word/document.xml');
    if(!part)throw new Error('That does not look like a .docx file.');
    return docxXmlToText(await part.async('string'));
  }
  if(n.endsWith('.pdf')){
    await loadLib(LIBS.pdfworker);await loadLib(LIBS.pdfjs);
    const lib=window.pdfjsLib;lib.GlobalWorkerOptions.workerSrc=LIBS.pdfworker;
    const pdf=await lib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise,pages=[];
    for(let i=1;i<=pdf.numPages;i++){
      const c=await (await pdf.getPage(i)).getTextContent(),rows={};
      c.items.forEach(it=>{const y=Math.round(it.transform[5]/3);(rows[y]=rows[y]||[]).push({x:it.transform[4],t:it.str});});
      pages.push(Object.keys(rows).map(Number).sort((a,b)=>b-a).map(y=>rows[y].sort((a,b)=>a.x-b.x).map(o=>o.t).join(' ').replace(/\s+/g,' ').trim()).filter(Boolean).join('\n'));
    }
    return pages.join('\n');
  }
  throw new Error('Use a .docx, .pdf or .txt file.');
}
function coerceResume(o){
  const r=norm(clone(EMPTY)),sv=v=>typeof v==='string'?v.trim():(v==null?'':String(v));
  ['name','address','phone','email','linkedin','website','objective','dob','civil','citizen'].forEach(k=>{if(o[k]!=null)r[k]=sv(o[k]);});
  ['education','experience','leadership','trainings','licenses'].forEach(k=>{
    if(Array.isArray(o[k]))r[k]=o[k].filter(e=>e&&typeof e==='object').map(e=>({org:sv(e.org),loc:sv(e.loc),title:sv(e.title),dates:sv(e.dates),bullets:Array.isArray(e.bullets)?e.bullets.map(sv).filter(Boolean).join('\n'):sv(e.bullets)}));
    if(!r[k].length)r[k]=[blank(k)];
  });
  if(Array.isArray(o.skills)){r.skills=o.skills.filter(k=>k&&typeof k==='object').map(k=>({label:sv(k.label),items:sv(k.items)}));}
  if(!r.skills.length)r.skills=[blank('skills')];
  r.preset=S.preset;r.paper=S.paper;r.order=S.order;r.refsMode='request';
  return r;
}
function basicParse(text){
  const r=norm(clone(EMPTY)),lines=text.split('\n').map(l=>l.trim()).filter(Boolean);
  r.preset=S.preset;r.paper=S.paper;r.order=S.order;
  r.name=(lines[0]||'').slice(0,80);
  const em=text.match(/[^\s@|]+@[^\s@|]+\.[A-Za-z]{2,}/);if(em)r.email=em[0];
  const ph=text.match(/(\+?\d[\d\s().-]{7,}\d)/);if(ph)r.phone=ph[1].trim();
  const li=text.match(/linkedin\.com\/[^\s|]+/i);if(li)r.linkedin=li[0];
  r.experience=[{org:'',loc:'',title:'Imported text (organize this into entries)',dates:'',bullets:lines.slice(1,70).join('\n')}];
  return r;
}
async function importFile(f){
  const st='#importStatus';setStatus(st,'Reading '+f.name+'...');
  let text='';
  try{text=await extractText(f);}catch(e){setStatus(st,'Could not read that file: '+(e.message||'unknown error'));return;}
  text=text.replace(/\r/g,'').trim();
  if(text.length<40){setStatus(st,'No readable text found. Scanned PDFs need OCR: upload a .docx or a text-based PDF instead.');return;}
  let r=null;
  if(AI){
    r=await askJSON(`Convert this resume text into structured JSON. Copy the person's own words faithfully. Do NOT invent or embellish anything; use empty strings for anything missing.
Rules: dates as "Month YYYY – Month YYYY" (or "Present"). Bullets are plain strings. Put school entries in "education" (most recent first), jobs in "experience", clubs/volunteering/projects in "leadership", seminars/courses in "trainings", licenses/eligibilities/certifications in "licenses". "skills" rows are {label, items} with comma-separated items. "objective" is a career objective or summary if present.
Reply with ONLY this JSON:
{"name":string,"address":string,"phone":string,"email":string,"linkedin":string,"website":string,"objective":string,"dob":string,"civil":string,"citizen":string,
"education":[{"org":string,"loc":string,"title":string,"dates":string,"bullets":[string]}],
"experience":[same shape],"leadership":[same shape],"trainings":[same shape],"licenses":[same shape],
"skills":[{"label":string,"items":string}]}

RESUME TEXT:
${text.slice(0,40000)}`,st);
  }
  const data=r&&typeof r==='object'&&!Array.isArray(r)?coerceResume(r):basicParse(text);
  addVersion({id:uid(),name:'Imported - '+f.name.replace(/\.[^.]+$/,''),data:data});
  setStatus('#importStatus',r?'Imported as a new version. Check every field, especially dates and bullets.':'AI was unavailable, so only your contact details were filled and the rest was copied into one Experience entry. Organize it by hand.');
}


/* cover letter: AI + PDF */
async function coverAI(){
  const st='#cStatus',j=D.job;
  if(!j.position.trim()||!j.company.trim()){setStatus(st,'Add the position and company first.');return;}
  const r=await askJSON(`Write the body paragraphs of a cover letter for this job seeker.

RULES (strict):
- Use ONLY facts in the resume below. Never invent employers, tools, numbers, certifications or results.
- 3 to 5 paragraphs, 220 to 330 words in total, first person, ${D.cover.tone==='warm'?'warm and enthusiastic but professional':'formal and professional'} tone.
- Paragraph 1 names the position and company${j.source.trim()?' and says the job was found through '+j.source.trim():''}. Include at least two measurable achievements from the resume, connect them to the main requirements in the job posting, and name the company when explaining why the candidate wants this job. End with a short call to action.
- Do not copy sentences from the posting. No salutation, no closing line, no signature, no placeholders, no markdown.

Reply with ONLY this JSON: {"paragraphs":[string]}

JOB: ${j.position} at ${j.company}
JOB POSTING:
${(j.desc||'(not provided)').slice(0,8000)}

CANDIDATE NOTES ON WHY THIS COMPANY: ${D.cover.why||'(none)'}

RESUME:
${toText(model(S)).slice(0,9000)}`,st);
  if(!r||!Array.isArray(r.paragraphs)||!r.paragraphs.length){if(r)setStatus(st,'The AI reply was empty. Try again.');return;}
  D.cover.aiText=r.paragraphs.map(x=>String(x).trim()).filter(Boolean).join('\n\n');
  saveDocs();renderCoverForm();refreshCover();
  setStatus('#cStatus','AI-written text is in use. Read it closely and edit anything that is not exactly true before you send it.');
}
$('#cForm').addEventListener('click',e=>{
  if(e.target.id==='cAi')coverAI();
  if(e.target.id==='cAiOff'){D.cover.aiText='';saveDocs();renderCoverForm();refreshCover();}
});
$('#cPdf').onclick=()=>pdfDownload('cover');
function coverPdf(L){
  const M=model(S),w=newPdf();w.center(nm(),14,'bold');if(M.contact.length)w.center(M.contact.join(' | '),10,'normal');
  if(L.date)w.para(L.date,{before:12});
  L.rec.forEach((t,i)=>w.para(t,{before:i===0?12:0}));
  w.para(L.sal,{before:12});L.paras.forEach(t=>w.para(t,{before:8}));w.para(L.close,{before:12});w.para(nm(),{before:24});
  return w.finish(nm()+' - Cover Letter');
}


/* ===== Tracker ===== */
const TK='resume-gen-tracker-v1';
const isoLocal=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const todayISO=()=>isoLocal(new Date());
const addDays=(iso,n)=>{const d=new Date(iso+'T00:00:00');d.setDate(d.getDate()+n);return isoLocal(d);};
const longDate=iso=>iso?new Date(iso+'T00:00:00').toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}):'';
const STAT=['Wishlist','Applied','Interview','Offer','Rejected','Withdrawn'];
function tSample(){const t=todayISO();return[
  {id:uid(),company:'Sample Cyber Defense Corp.',role:'Junior Security Analyst',applied:addDays(t,-9),status:'Applied',follow:addDays(t,-2),notes:'Applied through the careers page'},
  {id:uid(),company:'Sample Bank Inc.',role:'SOC Analyst (L1)',applied:addDays(t,-4),status:'Interview',follow:addDays(t,3),notes:'Technical interview scheduled'},
  {id:uid(),company:'Sample IT Services',role:'IT Security Technician',applied:addDays(t,-1),status:'Applied',follow:addDays(t,6),notes:''}];}
let T=null;try{T=JSON.parse(localStorage.getItem(TK)||'null');}catch(e){}
if(!Array.isArray(T))T=tSample();
const saveT=()=>{try{localStorage.setItem(TK,JSON.stringify(T));}catch(e){}};
const isDue=r=>['Applied','Interview'].indexOf(r.status)>=0&&!!r.follow&&r.follow<=todayISO();
function renderTracker(){
  const counts={};STAT.forEach(x=>{counts[x]=0;});T.forEach(r=>{counts[r.status]=(counts[r.status]||0)+1;});
  const due=T.filter(isDue).length;
  $('#tSummary').innerHTML=`<div class="chips">${STAT.map(x=>`<span class="badge">${x}: ${counts[x]}</span>`).join('')}<span class="badge ${due?'due':''}">Follow-ups due: ${due}</span></div><p class="hint" style="margin:8px 0 0">Follow-up dates default to one week after you apply. Rows turn orange when a follow-up is due. This list is saved in this browser only, so download the .csv now and then as a backup.</p>`;
  $('#tTable').innerHTML=T.length?`<table class="tt"><thead><tr><th>Company</th><th>Role</th><th>Applied</th><th>Status</th><th>Follow up</th><th>Notes</th><th></th></tr></thead><tbody>${T.map(r=>`<tr class="${isDue(r)?'due':''}" data-id="${r.id}">
    <td><input data-t="company" value="${esc(r.company)}"></td><td><input data-t="role" value="${esc(r.role)}"></td>
    <td><input type="date" data-t="applied" value="${esc(r.applied)}"></td>
    <td><select data-t="status">${STAT.map(x=>`<option${x===r.status?' selected':''}>${x}</option>`).join('')}</select></td>
    <td><input type="date" data-t="follow" value="${esc(r.follow)}"></td><td><input data-t="notes" value="${esc(r.notes)}"></td>
    <td style="white-space:nowrap">${isDue(r)?'<span class="badge due">Follow up now</span> ':''}<button data-ta="mail">Follow-up email</button> <button data-ta="del" title="Delete">&times;</button></td></tr>`).join('')}</tbody></table>`:'<p class="hint">No applications yet. Click "+ Add application".</p>';
}
const rowOf=el=>{const tr=el.closest('tr');return tr?T.find(x=>x.id===tr.dataset.id):null;};
$('#tTable').addEventListener('input',e=>{const f=e.target.dataset&&e.target.dataset.t;const r=f&&rowOf(e.target);if(!r)return;r[f]=e.target.value;saveT();});
$('#tTable').addEventListener('change',e=>{
  const f=e.target.dataset&&e.target.dataset.t;const r=f&&rowOf(e.target);if(!r)return;
  r[f]=e.target.value;if(f==='applied'&&e.target.value&&!r.follow)r.follow=addDays(e.target.value,7);
  saveT();if(f==='applied'||f==='follow'||f==='status')renderTracker();
});
let tDelArm='';
$('#tTable').addEventListener('click',e=>{
  const b=e.target.closest('[data-ta]');if(!b)return;const r=rowOf(b);if(!r)return;
  if(b.dataset.ta==='del'){
    if(tDelArm===r.id){T=T.filter(x=>x!==r);tDelArm='';saveT();renderTracker();}
    else{tDelArm=r.id;toast('Click the x again to delete this row');setTimeout(()=>{if(tDelArm===r.id)tDelArm='';},3000);}
  }else if(b.dataset.ta==='mail'){
    D.job.company=r.company;D.job.position=r.role;D.email.type='followup';D.email.date=longDate(r.applied);saveDocs();showTab('email');
  }
});
$('#tAdd').onclick=()=>{T.unshift({id:uid(),company:'',role:'',applied:todayISO(),status:'Applied',follow:addDays(todayISO(),7),notes:''});saveT();renderTracker();};
$('#tFromJob').onclick=()=>{
  if(!D.job.company.trim()&&!D.job.position.trim()){toast('Fill in the Job target on the Cover letter or Email tab first.');return;}
  T.unshift({id:uid(),company:D.job.company,role:D.job.position,applied:todayISO(),status:'Applied',follow:addDays(todayISO(),7),notes:''});saveT();renderTracker();toast('Added');
};
$('#tSort').onclick=()=>{T.sort((a,b)=>(a.follow||'9999').localeCompare(b.follow||'9999'));saveT();renderTracker();};
$('#tSample').onclick=()=>{T=tSample();saveT();renderTracker();toast('Sample loaded');};
let tClearArm=0;
$('#tClear').onclick=()=>{if(Date.now()-tClearArm<3000){T=[];saveT();renderTracker();}else{tClearArm=Date.now();toast('Click Clear all again within 3 seconds to confirm');}};
$('#tCsv').onclick=()=>{
  const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
  const rows=[['Company','Role','Applied','Status','Follow up','Notes']].concat(T.map(r=>[r.company,r.role,r.applied,r.status,r.follow,r.notes]));
  saveFile('job_applications.csv',rows.map(r=>r.map(q).join(',')).join('\r\n')+'\r\n');
};

/* ===== Interview prep ===== */
const IK='resume-gen-interview-v1';
let I=null;try{I=JSON.parse(localStorage.getItem(IK)||'null');}catch(e){}
I=Object.assign({star:{},ai:[]},I||{});
const saveI=()=>{try{localStorage.setItem(IK,JSON.stringify(I));}catch(e){}};
const hashStr=t=>{let h=5381;for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))|0;return 'b'+(h>>>0).toString(36);};
const BASE_Q=[
 {c:'Opener',q:'Tell me about yourself.',t:'Use a 60 to 90 second arc: your present role or studies, two relevant achievements, and why this job. Do not recite your resume.'},
 {c:'Motivation',q:'Why do you want to work here, and why this role?',t:'Name something specific about the company (its product, clients or mission), then connect it to your skills.'},
 {c:'Fit',q:'Why should we hire you?',t:'Pick your two strongest matches to the posting and back each with a result and a number.'},
 {c:'Strengths',q:'What are your greatest strengths?',t:'Choose strengths the job needs and give one short example for each.'},
 {c:'Weakness',q:'What is a weakness you are working on?',t:'Name a real, non-critical weakness and the concrete steps you are taking to improve it.'},
 {c:'Behavioral',q:'Tell me about a time you handled a tight deadline or a heavy workload.',t:'Use STAR: situation, task, action, result. Quantify the result.'},
 {c:'Behavioral',q:'Describe a time you made a mistake. What did you do?',t:'Own it, explain the fix, and say what you changed so it would not happen again.'},
 {c:'Behavioral',q:'Tell me about a time you disagreed with a teammate or supervisor.',t:'Show respect and problem solving. Focus on the outcome for the team.'},
 {c:'Behavioral',q:'Give an example of when you learned something new quickly.',t:'Pick something recent and relevant to the role, such as a tool or a certification.'},
 {c:'Future',q:'Where do you see yourself in five years?',t:'Show ambition that fits the role, such as growing into senior responsibilities here.'},
 {c:'Closing',q:'Do you have any questions for us?',t:'Ask about the team, how success is measured in the first 90 days, and training or growth.'}];
const PH_Q=[
 {c:'Philippines',q:'What is your expected salary?',t:'Research the market range first. Give a range in PHP per month and say it is open to discussion based on the full package.'},
 {c:'Philippines',q:'Are you open to shifting schedules, onsite or hybrid work?',t:'Be honest about your limits. If you are flexible, say so, and mention any commute or schedule constraints early.'},
 {c:'Philippines',q:'When can you start?',t:'State your notice period (often 30 days for employees; check your contract) or say "immediately" if you are free.'}];
const SEC_Q=[
 {c:'Technical',q:'Walk me through how you would triage a suspected phishing email.',t:'Preserve the message, check headers and links safely, search for other recipients, block indicators, reset affected credentials, document and escalate.'},
 {c:'Technical',q:'What is the difference between an IDS and an IPS?',t:'An IDS detects and alerts; an IPS sits inline and can block. Mention tuning and false positives.'},
 {c:'Technical',q:'Explain the CIA triad and give an example of each part.',t:'Confidentiality, integrity, availability. Use a real example for each, such as encryption, hashing and backups.'},
 {c:'Technical',q:'How do you prioritize several alerts at once?',t:'Severity, asset criticality, threat intelligence and SLA. Escalate quickly and document your reasoning.'},
 {c:'Technical',q:'What happens when you type a URL into a browser?',t:'DNS lookup, TCP handshake, TLS, HTTP request and response. Mention where attackers interfere, such as DNS poisoning or man-in-the-middle.'},
 {c:'Technical',q:'What is MITRE ATT&CK and how have you used it?',t:'A knowledge base of attacker tactics and techniques. Give an example of mapping an alert or detection to a technique.'},
 {c:'Technical',q:'What is the difference between a vulnerability, a threat and a risk?',t:'Weakness, something that can exploit it, and the likelihood and impact of that happening.'},
 {c:'Technical',q:'You find malware on a workstation. What do you do?',t:'Follow the incident response phases: isolate, preserve evidence, scope, eradicate, recover, then lessons learned.'}];
function allQuestions(){
  const ctx=((D.job.position||'')+' '+(D.job.desc||'')).toLowerCase();let q=BASE_Q.slice();
  if(S.preset==='ph')q=q.concat(PH_Q);
  if(/secur|\bsoc\b|cyber|infosec|incident|siem|network/.test(ctx))q=q.concat(SEC_Q);
  return q;
}
function renderInterviewForm(){
  $('#iForm').innerHTML=jobCard()+`<section class="card"><h2>AI interview coach</h2><p class="hint">Claude reads your active resume and the job posting, then writes likely questions with STAR answer drafts built only from facts in your resume. Missing details are marked [add detail]. You still need to practice them out loud.</p>
    <div class="toolbar"><button id="iAi" class="pri ai-only">Generate tailored questions</button>${I.ai.length?'<button id="iAiClear">Clear AI questions</button>':''}</div><div class="status" id="iStatus"></div></section>`;
}
$('#iForm').addEventListener('input',onDocField);$('#iForm').addEventListener('change',onDocField);
$('#iForm').addEventListener('click',e=>{if(e.target.id==='iAi')interviewAI();if(e.target.id==='iAiClear'){I.ai=[];saveI();renderInterviewForm();renderInterview();}});
let pcur=null,ptimer=null,pleft=120;
const mmss=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
function stopPractice(){if(ptimer){clearInterval(ptimer);ptimer=null;}}
function drawPractice(){
  const el=$('#iPractice');if(!el)return;
  el.innerHTML=(pcur?`<div class="qcard"><div class="cat">${esc(pcur.c)}</div><div class="big">${esc(pcur.q)}</div><div class="tip" id="iTipBox" hidden>${esc(pcur.t||'')}</div></div>
    <div class="toolbar"><button id="iRand">Another question</button><button id="iTip">Show tip</button><button id="iStart">${ptimer?'Pause':'Start timer'}</button><button id="iReset">Reset</button><span class="timer" id="iTime">${mmss(pleft)}</span></div>`
    :`<p class="hint">Answer out loud against a two-minute timer, the way a real interview feels.</p><button id="iRand" class="pri">Random question</button>`);
}
function pool(){return allQuestions().concat(I.ai.map(a=>({c:a.category||'AI',q:a.question,t:a.why})));}
function interviewAI(){
  return (async()=>{
    if(!D.job.position.trim()){setStatus('#iStatus','Add the position in the Job target first.');return;}
    const r=await askJSON(`You are an interview coach. Prepare this candidate for this job interview using ONLY facts in the resume. Never invent employers, tools, numbers or results; where a STAR detail is missing, write "[add detail]".

Return ONLY this JSON:
{"questions":[{"category":string,"question":string,"why":string,"star":{"situation":string,"task":string,"action":string,"result":string}}]}
Write 8 questions: about 5 behavioral questions whose STAR drafts come from different resume entries, and 3 role-specific questions. "why" is one sentence on what the interviewer is testing. Each STAR field is under 40 words, first person, plain text. For role-specific technical questions, put a short outline of a strong answer in "action" and leave the other STAR fields empty.

JOB: ${D.job.position} at ${D.job.company||'(company not given)'}
JOB POSTING:
${(D.job.desc||'(not provided)').slice(0,8000)}

RESUME:
${toText(model(S)).slice(0,9000)}`,'#iStatus');
    if(!r||!Array.isArray(r.questions)||!r.questions.length){if(r)setStatus('#iStatus','The AI reply was empty. Try again.');return;}
    const sv=v=>String(v==null?'':v);
    I.ai=r.questions.slice(0,10).map(x=>({category:sv(x.category),question:sv(x.question),why:sv(x.why),star:{situation:sv(x.star&&x.star.situation),task:sv(x.star&&x.star.task),action:sv(x.star&&x.star.action),result:sv(x.star&&x.star.result)}})).filter(x=>x.question);
    saveI();renderInterviewForm();renderInterview();setStatus('#iStatus','Done. Check every draft against what really happened before you rehearse it.');
  })();
}
function starCompose(st){const p=(l,v)=>v&&v.trim()?`${l}: ${v.trim().replace(/[.\s]+$/,'')}.`:'';return[p('Situation',st.s),p('Task',st.t),p('Action',st.a),p('Result',st.r)].filter(Boolean).join(' ');}
function renderInterview(){
  const bank=allQuestions(),groups={};bank.forEach(q=>{(groups[q.c]=groups[q.c]||[]).push(q);});
  const bullets=[];['experience','leadership'].forEach(k=>S[k].forEach(e=>bulletsOf(e.bullets).forEach(b=>bullets.push({b:b,where:[e.title,e.org].filter(Boolean).join(', ')}))));
  $('#iSide').innerHTML=
   `<section class="card"><h2>Practice</h2><div id="iPractice"></div></section>`+
   (I.ai.length?`<section class="card"><h2>Tailored questions (AI drafts)</h2>${I.ai.map((a,i)=>`<details ${i===0?'open':''} style="margin:0 0 8px"><summary style="cursor:pointer;color:var(--ink);font-weight:600">${esc(a.question)}</summary>
      <div class="tip" style="margin:6px 0">${esc(a.category)}${a.why?': '+esc(a.why):''}</div>
      ${['situation','task','action','result'].map(k=>a.star[k]?`<div style="margin:3px 0"><b>${k.charAt(0).toUpperCase()+k.slice(1)}:</b> ${esc(a.star[k])}</div>`:'').join('')}
      <button data-copy="${esc(starCompose({s:a.star.situation,t:a.star.task,a:a.star.action,r:a.star.result}))}" style="margin-top:6px">Copy answer</button></details>`).join('')}</section>`:'')+
   `<section class="card"><h2>Question bank${S.preset==='ph'?' (with Philippine questions)':''}</h2>${Object.keys(groups).map(g=>`<details style="margin:0 0 6px"><summary style="cursor:pointer;color:var(--ink);font-weight:600">${esc(g)} (${groups[g].length})</summary>${groups[g].map(q=>`<div class="qcard" style="margin:6px 0 0"><div class="q">${esc(q.q)}</div><div class="tip">${esc(q.t)}</div></div>`).join('')}</details>`).join('')}</section>`+
   `<section class="card"><h2>STAR builder from your resume</h2><p class="hint">Each bullet is the Action. Add the Situation and Task, and finish with the Result (include a number). Your notes are saved in this browser.</p>${bullets.length?bullets.map(x=>{
      const key=hashStr(x.b),st=I.star[key]||{},a=st.a!==undefined?st.a:x.b;
      return `<div class="qcard" data-key="${key}"><div class="cat">${esc(x.where)}</div>
        <label class="f"><span>Situation</span><input data-star="s" value="${esc(st.s||'')}"></label>
        <label class="f"><span>Task</span><input data-star="t" value="${esc(st.t||'')}"></label>
        <label class="f"><span>Action</span><input data-star="a" value="${esc(a)}"></label>
        <label class="f"><span>Result</span><input data-star="r" value="${esc(st.r||'')}"></label>
        <div class="tip" style="margin:6px 0" data-comp>${esc(starCompose({s:st.s,t:st.t,a:a,r:st.r}))}</div>
        <button data-copycomp>Copy answer</button></div>`;}).join(''):'<p class="hint">Add experience bullets on the Resume tab to build STAR answers.</p>'}</section>`;
  drawPractice();
}
$('#iSide').addEventListener('input',e=>{
  const f=e.target.dataset&&e.target.dataset.star;if(!f)return;
  const card=e.target.closest('[data-key]'),key=card.dataset.key;
  const st=I.star[key]=I.star[key]||{};st[f]=e.target.value;
  const a=st.a!==undefined?st.a:card.querySelector('[data-star=a]').value;
  card.querySelector('[data-comp]').textContent=starCompose({s:st.s,t:st.t,a:a,r:st.r});saveI();
});
$('#iSide').addEventListener('click',e=>{
  const id=e.target.id;
  if(e.target.dataset&&e.target.dataset.copy!==undefined){copyText(e.target.dataset.copy,'Copied');return;}
  if(e.target.dataset&&e.target.dataset.copycomp!==undefined){copyText(e.target.closest('[data-key]').querySelector('[data-comp]').textContent,'Answer copied');return;}
  if(id==='iRand'){const p=pool();pcur=p[Math.floor(Math.random()*p.length)];stopPractice();pleft=120;drawPractice();}
  else if(id==='iTip'){const b=$('#iTipBox');if(b){b.hidden=!b.hidden;e.target.textContent=b.hidden?'Show tip':'Hide tip';}}
  else if(id==='iStart'){
    if(ptimer){stopPractice();}
    else{if(pleft<=0)pleft=120;ptimer=setInterval(()=>{pleft--;const t=$('#iTime');if(t)t.textContent=mmss(Math.max(pleft,0));if(pleft<=0){stopPractice();drawPractice();toast('Time is up');}},1000);}
    drawPractice();
  }
  else if(id==='iReset'){stopPractice();pleft=120;drawPractice();}
});

/* ===== PH tools ===== */
const DECL='I hereby certify that the above information is true and correct to the best of my knowledge.';
const MONTHS=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
function fmtMY(t){
  t=(t||'').trim();if(/present|current/i.test(t))return'Present';
  const m=t.match(/([A-Za-z]{3,})\.?\s*(?:\d{1,2},?\s*)?((?:19|20)\d{2})/);
  if(m){const i=MONTHS.indexOf(m[1].slice(0,3).toLowerCase());if(i>=0)return String(i+1).padStart(2,'0')+'/'+m[2];}
  const y=t.match(/\b((?:19|20)\d{2})\b/);return y?y[1]:t;
}
function dateRange(d){
  d=(d||'').trim();if(!d)return'[from] to [to]';
  const parts=d.split(/\s*(?:–|—|-|\bto\b)\s*/i).filter(Boolean);
  return parts.length>=2?fmtMY(parts[0])+' to '+fmtMY(parts[1]):fmtMY(d);
}
const levelOf=t=>/senior high|grade 1[12]|high school|secondary/i.test(t)?'Secondary (Senior High School)':/master|doctor|ph\.?d|graduate (studies|school)/i.test(t)?'Graduate Studies':/vocational|trade|tesda|diploma|certificate/i.test(t)?'Vocational / Trade Course':/bachelor|\bb\.?s\.?\b|\bb\.?a\.?\b|college|associate/i.test(t)?'College':'[level]';
function dobFmt(){const t=(S.dob||'').trim();if(!t)return'[mm/dd/yyyy]';const d=new Date(t);if(isNaN(d))return t;return String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0')+'/'+d.getFullYear();}
function pdsText(){
  const M=model(clone(Object.assign({},S,{preset:'ph',refsMode:'list'})));
  const L=[],sec=t=>{L.push('','== '+t+' ==');},ent=k=>{const s=M.sections.find(x=>x.id===k);return s&&s.entries?s.entries:[];};
  const tk=(S.name||'').trim().split(/\s+/).filter(Boolean),sur=tk.length>1?tk.pop():'',first=tk.join(' ');
  L.push('PERSONAL DATA SHEET WORKSHEET (for CS Form 212)','Use this to fill in the official CSC form. It is not a substitute for it.');
  sec('I. PERSONAL INFORMATION');
  L.push('Surname: '+(sur||'[surname]'),'First name: '+(first||'[first name]'),'Middle name: [full middle name, usually mother\'s maiden surname]','Date of birth (mm/dd/yyyy): '+dobFmt(),'Civil status: '+((S.civil||'').trim()||'[civil status]'),'Citizenship: '+((S.citizen||'').trim()||'[citizenship]'),'Residential address: '+((S.address||'').trim()||'[address]'),'Mobile no.: '+((S.phone||'').trim()||'[mobile]'),'Email address: '+((S.email||'').trim()||'[email]'));
  sec('III. EDUCATIONAL BACKGROUND (list by level)');
  ent('education').forEach(e=>{
    const hon=e.bullets.filter(b=>/honor|cum laude|scholar|dean|summa|magna/i.test(b));
    L.push('','Level: '+levelOf(e.title+' '+e.org),'Name of school: '+(e.org||'[school]'),'Degree / course (write in full): '+(e.title||'[course]'),'Period of attendance (from to): '+dateRange(e.dates),'Highest level / units earned (if not graduated): [fill in if applicable]','Year graduated: '+(fmtMY((e.dates.split(/\s*(?:–|—|-|\bto\b)\s*/i)[1])||'').split('/').pop()||'[year]'),'Scholarship / academic honors: '+(hon.join('; ')||'[none]'));
  });
  sec('IV. CIVIL SERVICE ELIGIBILITY');
  const EL=/civil service|\bcsc\b|career service|\bprc\b|professional regulation|board exam|\bra\s?1080\b|eligib|licensure|licen[sc]ed|\bbar\b/i;
  const lic=ent('licenses'),el=lic.filter(e=>EL.test(e.org+' '+e.title)),certs=lic.filter(e=>!el.includes(e));
  if(!el.length)L.push('[none to report]');
  el.forEach(e=>{L.push('','Eligibility / license: '+(e.title||'[title]'),'Issued by: '+(e.org||'[body]'),'Rating: '+((e.bullets.join('; ').match(/\d+(\.\d+)?\s*%?/)||['[rating]'])[0]),'Date of examination: '+fmtMY(e.dates),'Place of examination: '+(e.loc||'[place]'),'License number and validity (if applicable): [fill in]');});
  sec('V. WORK EXPERIENCE (start with the most recent)');
  const ex=ent('experience');if(!ex.length)L.push('[none to report]');
  ex.forEach(e=>{L.push('','Inclusive dates (from to): '+dateRange(e.dates),'Position title (write in full): '+(e.title||'[title]'),'Department / agency / office / company: '+(e.org||'[employer]'),'Monthly salary: [fill in]','Salary grade and step (government only): [fill in]','Status of appointment: [fill in]','Government service (Y/N): [fill in]');if(e.bullets.length)L.push('Duties (for the attachment if needed): '+e.bullets.join('; '));});
  sec('VI. VOLUNTARY WORK / CIVIC INVOLVEMENT');
  const lv=ent('leadership');if(!lv.length)L.push('[none to report]');
  lv.forEach(e=>{L.push('','Organization: '+(e.org||'[organization]')+(e.loc?', '+e.loc:''),'Inclusive dates (from to): '+dateRange(e.dates),'Number of hours: [fill in]','Position / nature of work: '+(e.title||'[role]'));});
  sec('VII. LEARNING AND DEVELOPMENT');
  const tr=ent('trainings');if(!tr.length)L.push('[none to report]');
  tr.forEach(e=>{L.push('','Title: '+(e.title||'[title]'),'Inclusive dates (from to): '+dateRange(e.dates),'Number of hours: [fill in]','Type (managerial / supervisory / technical): [fill in]','Conducted / sponsored by: '+(e.org||'[provider]'));});
  sec('VIII. OTHER INFORMATION');
  const sk=M.sections.find(x=>x.id==='skills');L.push('Special skills and hobbies: '+(sk?sk.skills.map(k=>(k.label?k.label+': ':'')+k.items).join('; '):'[fill in]'));
  if(certs.length)L.push('Other certifications (not civil service eligibility; list under Learning and Development or Other Information): '+certs.map(e=>[e.title,e.org,e.dates].filter(Boolean).join(', ')).join('; '));
  sec('REFERENCES (the form asks for three)');
  const rf=ent('refs');if(!rf.length)L.push('[add three references with address and telephone]');
  rf.forEach(e=>{L.push('','Name: '+(e.org||'[name]'),'Address: [fill in]','Telephone / mobile: '+(e.loc||'[fill in]'));});
  return L.join('\n').trim()+'\n';
}
function pdsMissing(){
  const out=[];
  if(!(S.dob||'').trim())out.push('Date of birth');
  if(!(S.civil||'').trim())out.push('Civil status');
  if(!(S.citizen||'').trim())out.push('Citizenship');
  out.push('Place of birth, sex, height, weight and blood type','Government ID numbers the form asks for (GSIS, Pag-IBIG, PhilHealth, SSS, TIN). They are never typed into this tool.','Family background (spouse, children, parents), with the full middle name','For each job: monthly salary, salary grade and step, and status of appointment','For each seminar or volunteer entry: number of hours and the type of learning','Three references with addresses (and character references are not a substitute)','The signature, date and thumbmark on the official form, and a recent ID photo');
  if((S.refs||[]).filter(r=>(r.org||'').trim()).length<3)out.push('You have fewer than three references saved on the Resume tab');
  return out;
}
function renderPhForm(){
  $('#pForm').innerHTML=`<section class="card"><h2>Declaration &amp; data privacy</h2>
    <p class="hint">Philippine employers often expect a "true and correct" statement, and many ask for consent under the Data Privacy Act of 2012 (RA 10173). Choose a line to add to the end of your resume, or copy the wording for emails and forms.</p>
    ${SEL('Line at the end of your resume','declaration',S.declaration,[['none','None'],['certify','"True and correct" statement'],['consent','Statement + data privacy consent']],1)}
    <p class="hint" style="margin:8px 0 0">Applies to the active version: <b>${esc(activeV().name)}</b>. It does not appear in Harvard / US mode.</p></section>
    <section class="card"><h2>Personal Data Sheet (CS Form 212)</h2>
    <p class="hint">Government agencies usually require the Civil Service Commission's Personal Data Sheet in addition to a resume. The official form is a fixed template you complete yourself, so this tool builds a worksheet from your active resume, with dates and education levels in the format the form asks for, and lists what you still need to prepare. Always download the current official form from the CSC and check the job posting for what is required.</p></section>`;
}
$('#pForm').addEventListener('change',e=>{onField(e);renderPhSide();});
function renderPhSide(){
  const co=(D.job.company||'').trim()||'[company]';
  const block=(t,x)=>`<div style="margin-bottom:12px"><b style="font-size:12px">${esc(t)}</b><div class="pre" style="max-height:none;margin:4px 0 6px">${esc(x)}</div><button data-copy="${esc(x)}">Copy</button></div>`;
  $('#pSide').innerHTML=`<section class="card"><h2>Ready-to-paste wording</h2>
    ${block('Resume declaration',DECL)}
    ${block('Data privacy consent (resume or application form)','I consent to the collection, use and processing of my personal data by '+co+' for recruitment purposes, in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).')}
    ${block('Email footer','By sending this application, I consent to the processing of my personal data for recruitment purposes under the Data Privacy Act of 2012 (RA 10173).')}</section>
    <section class="card"><h2>PDS worksheet</h2><div class="toolbar"><button id="pCopy" class="pri">Copy worksheet</button><button id="pTxt">Download .txt</button></div>
    <div class="pre" id="pPre" style="margin-top:8px">${esc(pdsText())}</div></section>
    <section class="card"><h2>Details to prepare</h2><ul style="margin:0;padding-left:18px;font-size:13px">${pdsMissing().map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`;
}
$('#pSide').addEventListener('click',e=>{
  if(e.target.dataset&&e.target.dataset.copy!==undefined){copyText(e.target.dataset.copy,'Copied');return;}
  if(e.target.id==='pCopy')copyText(pdsText(),'Worksheet copied');
  if(e.target.id==='pTxt')saveFile(base().replace(/_Resume$/,'')+'_PDS_Worksheet.txt',pdsText());
});

renderForm();refresh();initTabs();
})();
