(() => {
  let timer=null,last='';
  function watch(){const R=window.RUMO,strip=document.querySelector('.objective-strip');if(!R||!strip)return;const run=()=>{const sig=strip.textContent.trim();if(sig===last)return;last=sig;clearTimeout(timer);timer=setTimeout(()=>R.sync(),180)};new MutationObserver(run).observe(strip,{subtree:true,childList:true,characterData:true,attributes:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)R.sync()});run()}
  setTimeout(watch,1500);
})();