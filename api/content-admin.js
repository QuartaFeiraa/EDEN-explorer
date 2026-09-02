const crypto=require('crypto');

const SUPABASE_URL='https://zycpeiyztqysjqejtour.supabase.co';
const TABLES={
  content_courses:['id','title','slug','category','description','icon','accent','estimated_days','minutes_per_day','level','order_index','published'],
  content_modules:['id','course_id','title','description','order_index','published'],
  content_lessons:['id','module_id','slug','title','summary','objective','content_md','example_md','pitfalls_md','recap_md','difficulty','estimated_minutes','order_index','published'],
  content_questions:['id','lesson_id','prompt','options','correct_answer','explanation','difficulty','order_index','published'],
  content_sources:['id','lesson_id','title','url','publisher','source_type','verified_at'],
  contest_content_map:['id','concurso_id','course_id','topic_pattern','priority','active'],
  content_imports:['id','file_name','file_size','extracted_chars','status','notes']
};
function send(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
function safeEqual(a,b){const A=Buffer.from(String(a||'')),B=Buffer.from(String(b||''));return A.length===B.length&&A.length>0&&crypto.timingSafeEqual(A,B)}
function auth(req){const expected=process.env.CONTENT_ADMIN_SECRET||process.env.CRON_SECRET||'';const got=req.headers['x-rumo-admin-key']||String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');return expected&&safeEqual(got,expected)}
function clean(table,data){const allowed=new Set(TABLES[table]||[]);const out={};for(const [k,v] of Object.entries(data||{}))if(allowed.has(k))out[k]=v;return out}
async function supa(path,options={}){const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!key)throw new Error('SUPABASE_SERVICE_ROLE_KEY ausente');const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',...(options.headers||{})}});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch(_){data=text}if(!r.ok)throw new Error(typeof data==='string'?data:(data?.message||`Supabase ${r.status}`));return data}
async function catalog(){const names=['content_courses','content_modules','content_lessons','content_questions','content_sources','contest_content_map','content_imports'];const rows=await Promise.all(names.map(t=>supa(`${t}?select=*&order=created_at.asc`).catch(()=>[])));return Object.fromEntries(names.map((n,i)=>[n,rows[i]]))}
module.exports=async(req,res)=>{
  if(req.method==='OPTIONS'){res.statusCode=204;return res.end()}
  if(!auth(req))return send(res,401,{error:'Chave de administração inválida.'});
  try{
    if(req.method==='GET')return send(res,200,{ok:true,catalog:await catalog()});
    if(req.method!=='POST')return send(res,405,{error:'Método não permitido.'});
    let body=req.body;if(typeof body==='string')body=JSON.parse(body||'{}');body=body||{};
    const action=body.action,table=body.table;
    if(action==='catalog')return send(res,200,{ok:true,catalog:await catalog()});
    if(!TABLES[table])return send(res,400,{error:'Tabela não permitida.'});
    if(action==='create'){
      const data=clean(table,body.data);if(!Object.keys(data).length)return send(res,400,{error:'Dados vazios.'});
      const result=await supa(table,{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(data)});return send(res,200,{ok:true,data:result});
    }
    if(action==='update'){
      if(!body.id)return send(res,400,{error:'ID obrigatório.'});const data=clean(table,body.data);delete data.id;
      const result=await supa(`${table}?id=eq.${encodeURIComponent(body.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(data)});return send(res,200,{ok:true,data:result});
    }
    if(action==='delete'){
      if(!body.id)return send(res,400,{error:'ID obrigatório.'});await supa(`${table}?id=eq.${encodeURIComponent(body.id)}`,{method:'DELETE'});return send(res,200,{ok:true});
    }
    return send(res,400,{error:'Ação inválida.'});
  }catch(e){console.error('content-admin',e);return send(res,500,{error:'Falha ao administrar conteúdo.',detail:String(e.message||e).slice(0,240)})}
};
