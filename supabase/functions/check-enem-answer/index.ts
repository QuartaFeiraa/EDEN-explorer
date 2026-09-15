const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8'
};
const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:cors});

Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(req.method!=='POST')return reply(405,{error:'method_not_allowed'});
  const len=Number(req.headers.get('content-length')||0);
  if(len>2048)return reply(413,{error:'body_too_large'});
  let raw='';
  try{raw=await req.text()}catch{return reply(400,{error:'invalid_body'})}
  if(raw.length>2048)return reply(413,{error:'body_too_large'});
  let body:any;
  try{body=JSON.parse(raw)}catch{return reply(400,{error:'invalid_json'})}
  const questionId=String(body?.question_id||'');
  const answer=String(body?.selected_answer||'').trim().toUpperCase();
  const elapsed=body?.elapsed_seconds==null?null:Number(body.elapsed_seconds);
  if(!UUID_RE.test(questionId)||!/^[A-Z0-9]{1,8}$/.test(answer))return reply(400,{error:'invalid_input'});
  if(elapsed!==null&&(!Number.isInteger(elapsed)||elapsed<0||elapsed>21600))return reply(400,{error:'invalid_elapsed'});

  const url=Deno.env.get('SUPABASE_URL');
  const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!url||!service)return reply(503,{error:'service_unavailable'});
  const adminHeaders={apikey:service,Authorization:`Bearer ${service}`};

  const qRes=await fetch(`${url}/rest/v1/question_bank?id=eq.${encodeURIComponent(questionId)}&active=eq.true&verified=eq.true&select=id`,{headers:adminHeaders});
  if(!qRes.ok)return reply(502,{error:'catalog_unavailable'});
  const rows=await qRes.json();
  if(!Array.isArray(rows)||!rows.length)return reply(404,{error:'question_not_available'});

  const sRes=await fetch(`${url}/rest/v1/question_solutions?question_id=eq.${encodeURIComponent(questionId)}&select=correct_answer,explanation&limit=1`,{headers:adminHeaders});
  if(!sRes.ok)return reply(502,{error:'solution_unavailable'});
  const sols=await sRes.json();
  const solution=sols?.[0];
  if(!solution)return reply(404,{error:'solution_not_available'});
  const correct=answer===String(solution.correct_answer||'').trim().toUpperCase();

  const auth=req.headers.get('authorization')||'';
  if(auth.startsWith('Bearer ')){
    const userRes=await fetch(`${url}/auth/v1/user`,{headers:{apikey:service,Authorization:auth}}).catch(()=>null);
    if(userRes?.ok){
      const user=await userRes.json();
      if(UUID_RE.test(String(user?.id||''))){
        await fetch(`${url}/rest/v1/question_attempts`,{
          method:'POST',
          headers:{...adminHeaders,'Content-Type':'application/json',Prefer:'return=minimal'},
          body:JSON.stringify({user_id:user.id,question_id:questionId,selected_answer:answer,correct,elapsed_seconds:elapsed})
        }).catch(()=>{});
      }
    }
  }
  return reply(200,{is_correct:correct,correct_answer:solution.correct_answer,explanation:solution.explanation||''});
});