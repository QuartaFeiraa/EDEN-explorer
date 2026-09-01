module.exports=async function handler(req,res){
  if(req.method!=='GET'){res.status(405).json({error:'method_not_allowed'});return}
  res.setHeader('Cache-Control','no-store');
  const key=process.env.VAPID_PUBLIC_KEY||'';
  res.status(200).json({enabled:!!key,publicKey:key||null});
};
