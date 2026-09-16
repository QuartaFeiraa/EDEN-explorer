# RUMO — superfície ativa do produto

Este arquivo existe para impedir regressões por "vibecoding": antes de alterar ou remover um arquivo, confirme se ele pertence à superfície ativa abaixo.

## Baseline atual

- Base segura histórica: `v9 Stable` (`139c11530f6a8acf4b7c075ab19c3c05226fd9e4`).
- Linha de produto atual: `rumo-enem-v1`.
- Checkpoint visual/técnico antes deste ciclo: `rumo-enem-v1-checkpoint-20260915`.
- `app/bootstrap.js` é a fonte de verdade para módulos ativos do frontend.
- `window.RUMO` é a fronteira de compatibilidade entre módulos.
- `master` continua divergente e não deve ser mesclado às cegas.

## Entrada e CSS ativos

Entrada:
- `index.html`
- `script.js`
- `manifest.webmanifest`
- `sw.js`

Base visual:
- `styles.css`
- `v2.css`
- `core-v1.css`
- `radar-v3.css`
- `product-v1.css`
- `enem-v1.css`
- `enem-visual-v2.css`
- `rumo-shell-v3.css`
- `rumo-polish-v4.css`
- `rumo-type-system-v6.css` — fonte final de verdade para escala tipográfica das 7 abas principais
- `rumo-account-v5.css` — somente conta/recuperação

Inativos / quarentena tipográfica:
- `rumo-readability-v4b.css`
- `rumo-study-readability-v5.css`

Eles permanecem no histórico por segurança, mas **não são carregados**. Não reativá-los sem revisão de especificidade, porque foram a causa de escalas conflitantes entre abas.

## Módulos essenciais no boot

Fundação:
- `app/core-v2.js`
- `app/security-normalize-v1.js`
- `app/planner-v1.js`

ENEM / shell:
- `app/enem-core-v1.js`
- `app/enem-visual-v2.js`
- `app/rumo-shell-v3.js`
- `app/enem-practice-v1.js`
- `app/enem-essay-v1.js`
- `app/enem-mock-v1.js`

Conta / planejamento:
- `app/account.js`
- `app/account-ux-v4.js`
- `app/account-recovery-v5.js`
- `app/engine-v2.js`
- `app/schedule-guard.js`
- `app/session.js`
- `app/reviews.js`

## Módulos opcionais / degradáveis

- `app/assistant.js`
- `app/edital.js`
- `app/account-extras-v2.js`
- `app/history-v1.js`
- `app/product-v1.js`
- `app/data-rights-v1.js`
- `app/pwa-v1.js`
- `app/radar-v2.js`
- `app/courses-v2.js`

## Backend ativo

Vercel:
- `api/_lib/supabase.js`
- `api/delete-account.js`

Supabase:
- tabelas ENEM `exam_tracks`, `exam_areas`, `exam_topics`, `question_bank`, `question_solutions`, `question_attempts`, `essay_topics`, `essay_drafts`;
- Edge Function `supabase/functions/check-enem-answer/index.ts` para corrigir respostas sem expor gabaritos no navegador;
- RLS e grants continuam sendo a barreira principal de dados de usuário;
- toda DDL/data migration de produção deve ter arquivo versionado em `supabase/migrations/`.

## Contratos de produto atuais

- ENEM é a entrada principal; concursos são o segundo eixo.
- Navegação principal: `Hoje · ENEM · Questões · Redação · Simulados · Concursos · Revisões`.
- Tipografia é definida por função e por aba; não usar escalas globais para "corrigir" microtexto.
- Títulos desktop das 7 abas ficam aproximadamente entre 32–40 px.
- Informação funcional de estudo não deve virar microtexto.
- Questões só revelam gabarito/explicação depois da submissão.
- Simulados seguram feedback até a finalização.
- Conta Supabase é opcional para começar, mas necessária para sincronização entre dispositivos.
- Recuperação de senha deve terminar dentro do próprio RUMO por fluxo `PASSWORD_RECOVERY`.

## Arquivos legados em quarentena

Arquivos como `app-v2.js`, `inicio.html`, `app/core.js`, `app/engine.js`, `app/radar.js`, `app/courses.js` e `app/billing.js` não fazem parte do bootstrap atual. São referência/legado e **não devem ser reativados nem apagados por impulso**. Remoção só depois de auditoria de referências + smoke test completo no mesmo commit.

## Gate para promoção

Antes de mover `rumo-enem-v1`:
1. sintaxe e contratos passam no CI;
2. Chromium passa desktop 1440/1366 e mobile 390/360;
3. todas as 7 abas passam sem overflow e com a escala tipográfica contratada;
4. Questões corrige uma questão real sem expor `question_solutions` no cliente;
5. Redação abre/salva rascunho e mantém competências legíveis;
6. UI de conta e recuperação de senha passa no smoke local;
7. Supabase Security Advisor = 0 lints;
8. migrations de produção estão versionadas;
9. deploy Vercel do commit termina em sucesso;
10. `master` permanece intocado até reconciliação deliberada.
