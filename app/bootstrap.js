(() => {
  const css=document.createElement('link');css.rel='stylesheet';css.href='./core-v1.css?v=1';document.head.appendChild(css);
  const files=['core.js','engine.js','session.js','reviews.js','edital.js','assistant.js','courses.js','billing.js'];
  const load=i=>{if(i>=files.length){document.documentElement.dataset.rumoVersion='1';document.dispatchEvent(new CustomEvent('rumo:booted'));return}const s=document.createElement('script');s.src=`./app/${files[i]}?v=1`;s.onload=()=>load(i+1);s.onerror=()=>load(i+1);document.body.appendChild(s)};
  load(0);
})();