/* Instant Cover Letter Studio — authored by Cornelius Aurelius.
   Pure, testable composition. Never invents achievements, experience or company facts. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.CoverLetterCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const normalize=s=>String(s??'').replace(/\r\n?/g,'\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').trim();
const single=s=>normalize(s).replace(/\s+/g,' ').slice(0,250);
const cleanParagraph=s=>normalize(s).replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').slice(0,2500);
const finish=s=>/[.!?]$/.test(s)?s:s+'.';
const properList=xs=>xs.length===1?xs[0]:xs.length===2?xs.join(' and '):xs.slice(0,-1).join(', ')+', and '+xs.at(-1);
const unique=xs=>[...new Set(xs.map(v=>single(v)).filter(Boolean))];
const skillList=v=>unique(normalize(v).split(/[,;\n]+/).map(s=>s.slice(0,75))).slice(0,7);
const STOP=new Set(('the and for are with you your our can will have has into from this that role team work company strong looking seeking about what when where why of to in on at as a an is it its or by how be ability skills experience excellent good outstanding proven years track record successful role work apply application position job skills team using across through their they them we us part seeking looking ability required preferred need needs job description').split(/\s+/));
const wordSet=v=>new Set(normalize(v).slice(0,5000).toLowerCase().split(/[^a-z0-9+#]+/).filter(w=>w.length>3&&!STOP.has(w)));
function matchSkills(skills,job){const jobWords=wordSet(normalize(job).slice(0,5000));return skills.filter(s=>[...wordSet(s)].some(w=>jobWords.has(w))).slice(0,4);}
function analyse(d){const skills=skillList(d.skills);const role=single(d.role);const company=single(d.company);const evidence=cleanParagraph(d.evidence);const job=cleanParagraph(d.job);return {skills,matched:matchSkills(skills,job),hasEvidence:!!evidence,hasMotivation:!!single(d.motivation),hasJob:!!job,complete:!!(single(d.name)&&role&&company),missing:[!single(d.name)?'your name':null,!role?'job title':null,!company?'company name':null].filter(Boolean)};}
const formats={balanced:'Balanced',concise:'Concise',detailed:'Detailed'};
const tones={confident:'Confident',warm:'Warm',direct:'Direct'};
function compose(data){
 const d=Object.fromEntries(Object.entries(data||{}).map(([k,v])=>[k,typeof v==='string'?v:'']));
 const report=analyse(d);if(!report.complete)return {ok:false,error:'Add '+properList(report.missing)+' to generate your letter.',report};
 const name=single(d.name),role=single(d.role),company=single(d.company),recipient=single(d.recipient),contact=single(d.contact),motivation=single(d.motivation),evidence=cleanParagraph(d.evidence);
 const style=formats[d.style]?d.style:'balanced';const tone=tones[d.tone]?d.tone:'confident';const locale=d.locale==='US'?'US':'UK';
 const greeting=recipient?`Dear ${recipient},`:'Dear Hiring Manager,';
 const salutation=recipient?(locale==='UK'?'Yours sincerely,':'Sincerely,'):(locale==='UK'?'Yours faithfully,':'Sincerely,');
 const opener=tone==='direct'?`Please consider my application for the ${role} role at ${company}.`:tone==='warm'?`I am pleased to apply for the ${role} position at ${company}.`:`I am writing to apply for the ${role} position at ${company}.`;
 const paragraphs=[opener];
 if(report.skills.length){
 const highlighted=style==='concise'?report.skills.slice(0,3):report.skills.slice(0,4);
 const start=tone==='direct'?'I would bring':tone==='warm'?'I would welcome the chance to bring':'My key strengths include';
 const body=start+' '+properList(highlighted)+(start==='My key strengths include'?'.':' to this role.');
 paragraphs.push(body);
 }
 if(evidence){
  const parts=evidence.split(/\n+/).map(v=>v.trim()).filter(Boolean);
  let body=parts.map(finish).join(' ');
  if(style==='concise')body=body.slice(0,600).replace(/\s+\S*$/,'').trim();
  paragraphs.push(style==='detailed'?`An example from my experience: ${body}`:body);
 }
 if(report.hasJob&&report.matched.length){
  paragraphs.push(`Your job description highlights ${properList(report.matched)}, which align with the strengths I have outlined.`);
 }
 if(motivation){paragraphs.push(`I am interested in this opportunity because ${finish(motivation.replace(/^[Bb]ecause\s+/,'').replace(/^[Ii]\s+/,'I ')).replace(/\.$/,'')}.`);}
 else if(style==='detailed'){paragraphs.push(`I would value the opportunity to learn more about the priorities of the ${role} position at ${company} and how I could contribute.`);}
 const closing= tone==='direct'?'Thank you for reviewing my application. I would welcome a conversation about how I can contribute.':tone==='warm'?'Thank you for your time and consideration. I would be delighted to discuss how I could contribute to your team.':'Thank you for considering my application. I would welcome the opportunity to discuss my suitability for the role.';
 paragraphs.push(closing);
 let output=[greeting,'',...paragraphs.flatMap(p=>[p,'']),salutation,name];if(contact)output.push(contact);
 const text=output.join('\n').replace(/\n{3,}/g,'\n\n').trim();
 const tips=[];
 if(!report.hasEvidence)tips.push('Add a specific achievement or example to make the letter more convincing.');
 if(!report.hasMotivation)tips.push('Add an authentic reason for wanting this role or organisation.');
 if(report.hasJob&&!report.matched.length)tips.push('No direct skill matches found: use the job advert to refine your skills, without claiming expertise you do not have.');
 if(!report.hasJob)tips.push('Paste a job advert to see which of your stated strengths match it.');
 return {ok:true,text,wordCount:text.trim().split(/\s+/).length,report,tips,style,tone,locale};
}
return {compose,analyse,skillList,matchSkills,normalise:normalize};
});
