(() => {
  'use strict';
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const labels={hoje:'Hoje',enem:'ENEM',questoes:'Questões',redacao:'Redação',simulados:'Simulados',concursos:'Concursos',revisoes:'Revisões'};
  const MATRIX_URL='https://www.gov.br/inep/pt-br/centrais-de-conteudo/acervo-linha-editorial/publicacoes-institucionais/avaliacoes-e-exames-da-educacao-basica/matrizes-de-referencia-enem';

  function font(){
    if(document.querySelector('link[data-rumo-jakarta]'))return;
    const pre=document.createElement('link');pre.rel='preconnect';pre.href='https://fonts.gstatic.com';pre.crossOrigin='anonymous';pre.dataset.rumoJakarta='1';document.head.appendChild(pre);
    const link=document.createElement('link');link.rel='stylesheet';link.href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';link.dataset.rumoJakarta='1';document.head.appendChild(link);
  }

  function brand(){
    const copy=q('.brand-copy');
    if(copy){const strong=q('strong',copy),sub=q('span',copy);if(strong)strong.textContent='RUMO';if(sub)sub.textContent='ENEM & concursos'}
  }

  function navGroups(){
    const nav=q('.sidebar nav');if(!nav)return;
    qa('.rumo-nav-group-v3',nav).forEach(x=>x.remove());
    const first=q('[data-tab="hoje"]',nav),contests=q('[data-tab="concursos"]',nav);
    const make=text=>{const x=document.createElement('div');x.className='rumo-nav-group-v3';x.textContent=text;return x};
    first?.before(make('Preparação'));
    contests?.before(make('Outros caminhos'));
  }

  function eden(){
    const f=q('.eden-footer');if(!f)return;
    f.dataset.links='1';
    f.innerHTML='<div class="eden-family-v3" aria-label="EDEN"><span class="eden-mark-v3" aria-hidden="true"></span><span class="eden-word-v3">eden</span></div><div class="eden-links-v3"><a href="./privacidade.html">Privacidade</a><a href="./termos.html">Termos</a></div>';
  }

  function topbar(){
    const bar=q('.topbar');if(!bar)return;
    let ctx=q('.rumo-top-context-v3',bar);
    if(!ctx){ctx=document.createElement('div');ctx.className='rumo-top-context-v3';ctx.innerHTML='<small>RUMO</small><i aria-hidden="true"></i><strong>Hoje</strong>';bar.prepend(ctx)}
    return ctx;
  }
  function context(id){const strong=q('.rumo-top-context-v3 strong');if(strong)strong.textContent=labels[id]||'RUMO'}

  function snapshot(){
    const head=q('#enem .rumo-section-head'),api=window.RUMO_ENEM;if(!head||!api)return;
    const intro=head.firstElementChild;if(intro)intro.classList.add('rumo-enem-intro-v3');
    let actions=q('.rumo-enem-actions-v3',intro);
    if(!actions&&intro){actions=document.createElement('div');actions.className='rumo-enem-actions-v3';actions.innerHTML='<button class="primary" data-v3-go="questoes">Resolver questões</button><button class="secondary" data-v3-go="simulados">Fazer simulado</button>';intro.appendChild(actions)}
    qa('[data-v3-go]',actions||document).forEach(b=>b.onclick=()=>api.shell.switchTab(b.dataset.v3Go));

    const oldSource=q('#enem .rumo-source-link');
    if(oldSource&&!oldSource.closest('.rumo-enem-snapshot-v3'))oldSource.remove();
    let box=q('.rumo-enem-snapshot-v3',head);
    if(!box){box=document.createElement('aside');box.className='rumo-enem-snapshot-v3';head.appendChild(box)}
    const d=api.data,accuracy=d.stats.attempts?Math.round(d.stats.correct/d.stats.attempts*100):0,topics=d.topics.length;
    box.innerHTML=`<small>SEU ENEM NO RUMO</small><div class="rumo-snapshot-grid-v3"><div><b>${d.questionCount}</b><span>questões ativas</span></div><div><b>${topics}</b><span>assuntos mapeados</span></div><div><b>${d.stats.attempts}</b><span>respondidas</span></div><div><b>${accuracy}%</b><span>acerto atual</span></div></div><a class="rumo-source-link" href="${MATRIX_URL}" target="_blank" rel="noopener noreferrer">Matriz oficial do Inep ↗</a>`;
  }

  function overview(){
    const root=q('#enem-overview'),api=window.RUMO_ENEM;if(!root||!api)return;
    if(q('.rumo-enem-content-v3',root))return;
    const areas=q('.rumo-area-list',root),axis=q('.rumo-axis',root),foot=q('.rumo-enem-footnote',root);if(!areas||!axis)return;
    const shell=document.createElement('div');shell.className='rumo-enem-content-v3';
    const main=document.createElement('div');main.className='rumo-enem-main-v3';
    const aside=document.createElement('aside');aside.className='rumo-enem-aside-v3';
    const label=document.createElement('div');label.className='rumo-overview-label-v3';
    label.innerHTML=`<div><small>CONTEÚDO</small><h2>Áreas do ENEM</h2></div><span>${api.data.topics.length} assuntos organizados</span>`;
    main.append(label,areas);aside.append(axis);if(foot)aside.append(foot);shell.append(main,aside);root.append(shell);
  }

  function decorateAreaActions(){
    const api=window.RUMO_ENEM;if(!api)return;
    qa('[data-enem-area]').forEach(button=>{
      if(button.dataset.v3Action)return;button.dataset.v3Action='1';
      if(button.dataset.enemArea==='enem-redacao')button.onclick=()=>api.shell.switchTab('redacao');
    });
  }

  function enhanceEnem(){snapshot();overview();decorateAreaActions();navGroups();eden()}
  function boot(){font();brand();topbar();navGroups();eden();enhanceEnem();document.body.dataset.rumoShell='nexo-v3'}

  document.addEventListener('rumo:enem-ready',enhanceEnem);
  document.addEventListener('rumo:booted',boot,{once:true});
  document.addEventListener('rumo:tab',e=>context(e.detail?.id));
  document.addEventListener('rumo:context',snapshot);
  boot();
})();
