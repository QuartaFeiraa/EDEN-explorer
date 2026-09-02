(() => {
  'use strict';
  const ALLOWED_PRIORITY=new Set(['baixa','media','alta']);

  function safePriority(value){
    const normalized=String(value||'').trim().toLowerCase();
    return ALLOWED_PRIORITY.has(normalized)?normalized:'media';
  }

  function normalize(){
    const state=window.RUMO?.state;
    if(!state)return;
    for(const materia of state.materias||[]){
      materia.prioridade=safePriority(materia.prioridade);
    }
  }

  normalize();
  document.addEventListener('rumo:context',normalize);
  document.addEventListener('rumo:structure',normalize);
  window.RUMO_SECURITY_NORMALIZE={safePriority,normalize};
})();
