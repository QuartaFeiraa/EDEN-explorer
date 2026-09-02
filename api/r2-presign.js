const crypto=require('crypto');
const {S3Client,PutObjectCommand,GetObjectCommand}=require('@aws-sdk/client-s3');
const {getSignedUrl}=require('@aws-sdk/s3-request-presigner');

function send(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
function safeEqual(a,b){const A=Buffer.from(String(a||'')),B=Buffer.from(String(b||''));return A.length===B.length&&A.length>0&&crypto.timingSafeEqual(A,B)}
function auth(req){const expected=process.env.CONTENT_ADMIN_SECRET||process.env.CRON_SECRET||'';const got=req.headers['x-rumo-admin-key']||String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');return expected&&safeEqual(got,expected)}
function config(){
  const accountId=process.env.R2_ACCOUNT_ID||'';
  const accessKeyId=process.env.R2_ACCESS_KEY_ID||'';
  const secretAccessKey=process.env.R2_SECRET_ACCESS_KEY||'';
  const bucket=process.env.R2_BUCKET_NAME||'';
  if(!accountId||!accessKeyId||!secretAccessKey||!bucket)throw new Error('R2 ainda não configurado no ambiente.');
  return {accountId,accessKeyId,secretAccessKey,bucket};
}
function client(c){return new S3Client({region:'auto',endpoint:`https://${c.accountId}.r2.cloudflarestorage.com`,credentials:{accessKeyId:c.accessKeyId,secretAccessKey:c.secretAccessKey}})}
function safeName(name){return String(name||'material.pdf').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(-110)||'material.pdf'}
function objectKey(name){const d=new Date();const yyyy=d.getUTCFullYear();const mm=String(d.getUTCMonth()+1).padStart(2,'0');return `sources/${yyyy}/${mm}/${crypto.randomUUID()}-${safeName(name)}`}

module.exports=async(req,res)=>{
  if(req.method==='OPTIONS'){res.statusCode=204;return res.end()}
  if(!auth(req))return send(res,401,{error:'Chave de administração inválida.'});
  if(req.method!=='POST')return send(res,405,{error:'Método não permitido.'});
  try{
    let body=req.body;if(typeof body==='string')body=JSON.parse(body||'{}');body=body||{};
    const c=config(),s3=client(c),action=body.action||'upload';
    if(action==='upload'){
      const fileName=String(body.fileName||'');
      const contentType=String(body.contentType||'application/pdf').toLowerCase();
      const size=Number(body.size||0);
      if(!fileName.toLowerCase().endsWith('.pdf')||contentType!=='application/pdf')return send(res,400,{error:'Por enquanto o arquivo precisa ser PDF.'});
      if(!Number.isFinite(size)||size<=0)return send(res,400,{error:'Tamanho de arquivo inválido.'});
      if(size>300*1024*1024)return send(res,413,{error:'PDF acima do limite operacional de 300 MB.'});
      const key=objectKey(fileName);
      const command=new PutObjectCommand({Bucket:c.bucket,Key:key,ContentType:'application/pdf',Metadata:{source:'eden-rumo'}});
      const uploadUrl=await getSignedUrl(s3,command,{expiresIn:900});
      return send(res,200,{ok:true,action:'upload',objectKey:key,uploadUrl,expiresIn:900,contentType:'application/pdf'});
    }
    if(action==='download'){
      const key=String(body.objectKey||'');
      if(!key.startsWith('sources/'))return send(res,400,{error:'Objeto inválido.'});
      const downloadUrl=await getSignedUrl(s3,new GetObjectCommand({Bucket:c.bucket,Key:key}),{expiresIn:300});
      return send(res,200,{ok:true,action:'download',downloadUrl,expiresIn:300});
    }
    return send(res,400,{error:'Ação inválida.'});
  }catch(e){console.error('r2-presign',e);return send(res,503,{error:'Armazenamento R2 indisponível.',detail:String(e.message||e).slice(0,180)})}
};
