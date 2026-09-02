# RUMO — superfície ativa do produto

Este arquivo existe para impedir regressões por "vibecoding": antes de alterar ou remover um arquivo, confirme se ele pertence à superfície ativa abaixo.

## Baseline

- Golden baseline: `v9 Stable` (`139c11530f6a8acf4b7c075ab19c3c05226fd9e4`).
- Branch de hardening: `rumo-v9-product-hardening`.
- `app/bootstrap.js` é a fonte de verdade para módulos ativos do frontend.
- `window.RUMO` é a fronteira de compatibilidade entre módulos.

## Entrada ativa

- `index.html`
- `script.js`
- `styles.css`
- `v2.css`
- `core-v1.css`
- `radar-v3.css`
- `product-v1.css`
- `manifest.webmanifest`
- `sw.js`

## Módulos ativos

Essenciais no boot:
- `app/core-v2.js`
- `app/security-normalize-v1.js`
- `app/account.js`
- `app/engine-v2.js`
- `app/schedule-guard.js`
- `app/session.js`
- `app/reviews.js`

Opcionais/degradáveis:
- `app/assistant.js`
- `app/edital.js`
- `app/account-extras-v2.js`
- `app/history-v1.js`
- `app/product-v1.js`
- `app/data-rights-v1.js`
- `app/pwa-v1.js`
- `app/radar-v2.js`
- `app/courses-v2.js`

Backend ativo:
- `api/_lib/supabase.js`
- `api/delete-account.js`

## Arquivos legados em quarentena

Arquivos como `app-v2.js`, `inicio.html`, `app/core.js`, `app/engine.js`, `app/radar.js`, `app/courses.js` e `app/billing.js` não fazem parte do bootstrap v9 atual. Eles são referência/legado e **não devem ser reativados nem apagados por impulso**. Remoção só depois de uma auditoria de referências + smoke test completo no mesmo commit.

## Regra para recursos posteriores ao v9

Nada do `master` pós-v9 entra por cópia em massa. Cada recurso precisa de:
1. ameaça e custo avaliados;
2. adaptação ao contrato atual;
3. testes de sucesso e falha degradada;
4. CI verde;
5. validação visual antes de promoção.
