# EDEN RUMO — Continuidade do projeto

**Atualizado em:** 31/10/2026  
**Repositório:** https://github.com/QuartaFeiraa/EDEN-explorer  
**Branch recomendada para continuidade:** `rumo-v9-product-hardening`

Este documento reúne o estado conhecido do EDEN RUMO, separa o que foi validado do que ainda precisa de verificação e define como continuar sem regredir o beta funcional.

---

## 1. Decisão principal: qual versão usar

| Referência | Commit | Estado | Uso |
|---|---|---|---|
| RUMO v9 Stable | `139c11530f6a8acf4b7c075ab19c3c05226fd9e4` | Baseline funcional comprovada | Referência obrigatória de regressão |
| `rumo-v9-product-hardening` | `e34e8d6c62cf0aa9ff5b0ad16f8979f352a38352` | 22 commits depois da v9; CI e status Vercel aprovados nesse commit | **Linha recomendada para continuar** |
| `master` | `910889bab2f0762f644f98a46688532f919faa6d` | 70 commits depois da v9; histórico divergente da linha de hardening | Snapshot para auditoria seletiva, não mesclar às cegas |

A comparação Git confirma que `master` e `rumo-v9-product-hardening` divergiram a partir da v9. No comparativo entre as duas linhas, `master` está 70 commits à frente e 22 commits atrás da branch de hardening. Portanto:

- Não usar `master` como substituto automático da linha de hardening.
- Não fazer merge amplo nem copiar módulos em massa.
- Preservar a v9 como golden baseline.
- Portar funcionalidades posteriores somente uma por vez, com análise de segurança, custo, comportamento degradado e testes.

## 2. O produto

O RUMO é o produto EDEN para orientar estudos, concursos e objetivos acadêmicos. A proposta é transformar um objetivo grande em próximos passos claros, manter um plano adaptável e tornar o progresso compreensível.

### Funcionalidades presentes na linha v9

- **Hoje / Dashboard:** objetivo atual, foco do dia, atividade semanal, desempenho e Radar.
- **Radar de concursos:** listagem, busca e filtros por situação, área e estado; consulta ao catálogo Supabase com fallback local.
- **Meu concurso / Objetivo:** configuração de objetivo e rotina; importação de edital PDF no navegador.
- **Planejamento:** tarefas de estudo, prática e revisão distribuídas conforme disponibilidade e prioridade.
- **Sessões de estudo:** registro de tempo, questões e acertos; atualização do histórico e dos indicadores.
- **Revisões:** organização do que precisa voltar, com base no progresso e nos erros.
- **Essenciais:** catálogo de cursos curtos para trabalho, provas e idiomas.
- **Assistente:** experiência contextual/local na baseline, sem dependência obrigatória de API paga de IA.
- **Conta e dados:** sincronização autenticada, preferências, exportação dos dados acessíveis em JSON e fluxo de exclusão de conta.
- **Tema:** alternância claro/escuro com preferência persistida.
- **PWA:** manifesto e suporte de instalação; a linha de hardening inclui estratégia de service worker com regras explícitas de cache.

A v9 foi registrada como estável após testes desktop/mobile, persistência, modo degradado do Supabase, Radar, Essenciais, tema, ausência de erros JavaScript e ausência de overflow horizontal. Esses resultados são o baseline histórico; devem ser repetidos na retomada antes de promover novas mudanças.

## 3. Arquitetura atual da linha de hardening

### Frontend

- HTML, CSS e JavaScript modular, sem framework obrigatório.
- `index.html` + `script.js` formam a entrada da aplicação.
- `app/bootstrap.js` controla a ordem de inicialização.
- `window.RUMO` é a fronteira de compatibilidade entre módulos.
- O shell deve continuar utilizável mesmo quando recursos opcionais falham.
- O modo visitante/local deve continuar útil sem exigir conta.

### Backend e dados

- **Supabase Auth + Postgres** são a base de autenticação e dados persistentes.
- RLS e grants do Postgres são a autoridade para acesso e propriedade dos dados; filtros do frontend não substituem autorização no banco.
- **Vercel Functions** são adaptadores para operações que exigem segredo ou execução confiável.
- Integrações de terceiros devem ficar atrás de adaptadores substituíveis.
- Mudanças de banco precisam de migrations versionadas em `supabase/migrations/`.

### Superfície ativa documentada

O arquivo `docs/ACTIVE-SURFACE.md` é a referência para não remover ou reativar código por engano.

**Boot essencial:**
- `app/core-v2.js`
- `app/security-normalize-v1.js`
- `app/account.js`
- `app/engine-v2.js`
- `app/schedule-guard.js`
- `app/session.js`
- `app/reviews.js`

**Módulos opcionais/degradáveis:**
- `app/assistant.js`
- `app/edital.js`
- `app/account-extras-v2.js`
- `app/history-v1.js`
- `app/product-v1.js`
- `app/data-rights-v1.js`
- `app/pwa-v1.js`
- `app/radar-v2.js`
- `app/courses-v2.js`

**Backend ativo na linha documentada:**
- `api/_lib/supabase.js`
- `api/delete-account.js`

Arquivos antigos como `app/core.js`, `app/engine.js`, `app/radar.js`, `app/courses.js`, `app-v2.js` e páginas de protótipo são legado/referência. Não reativar nem apagar sem auditoria de referências e regressão completa.

## 4. Evoluções já presentes na branch de hardening

A branch recomendada contém 22 commits além da v9 e inclui, entre outros:

- Contratos de engenharia, arquitetura, design, privacidade e segurança (`AGENTS.md`, `ARCHITECTURE.md`, `DESIGN.md`, `PRIVACY.md`, `SECURITY.md`).
- Workflow de hardening e validação automatizada.
- Normalização/allowlist de prioridades e dados de entrada.
- Planejador adaptativo com rotação de tópicos, sem ignorar revisões realmente vencidas ou prioridades pedagógicas.
- Geração idempotente de tarefas para evitar duplicação entre tentativas, abas ou dispositivos.
- Proteções adicionais no guardião de agenda.
- Parser de sessão JWT com comportamento fail-closed.
- Backend compartilhado para acesso ao Supabase.
- Endpoint autenticado de exclusão de conta, com validação de método/origem/sessão e tratamento seguro de falhas.
- Exportação e direitos de dados.
- Melhorias de PWA e regras de cache.
- Migrations para grants mínimos, hardening da função de criação de usuário e idempotência do planejamento.

### Migrations versionadas

1. `20260902_harden_data_api_least_privilege.sql` — restringe grants de `anon` e `authenticated` ao mínimo necessário.
2. `20260902_harden_handle_new_user_search_path.sql` — fixa `search_path` vazio e limita EXECUTE da função privilegiada.
3. `20260902_link_user_data_to_auth_users.sql` — registra integridade referencial com usuários de Auth.
4. `20260902_remove_duplicate_auth_user_foreign_keys.sql` — remove apenas constraints duplicadas introduzidas durante a auditoria, preservando as originais.
5. `20260905175413_planner_idempotency_and_session_guard.sql` — adiciona unicidade do slot do plano e funções privilegiadas para validar sessão e propriedade de objetos Storage.

**Importante:** a existência de uma migration no Git não prova que ela foi aplicada no projeto Supabase. Antes de qualquer DDL, comparar o histórico de migrations com o banco real e verificar os dados existentes.

## 5. Segurança — regras obrigatórias

A segurança tem precedência sobre conveniência, aparência e custo.

- O navegador é uma superfície não confiável.
- Chaves Supabase publicáveis podem aparecer no cliente; chaves secretas/service-role nunca.
- RLS **e** grants são necessários: grants limitam operações; RLS limita linhas.
- Toda escrita deve verificar propriedade do usuário no banco.
- Conteúdo remoto, dados do banco, texto de edital e saída de IA são entradas não confiáveis.
- HTML dinâmico deve ser escapado ou construído com APIs seguras do DOM; classes, URLs e tokens CSS precisam de allowlist/validação.
- Funções `SECURITY DEFINER` exigem `search_path` fixo/vazio, referências qualificadas e EXECUTE explícito.
- Endpoints privilegiados/destrutivos devem validar método, origem, autenticação, sessão ativa quando aplicável, tamanho/estrutura de entrada, `no-store` e falha segura.
- Service worker não pode armazenar respostas de `/api/`, Supabase, tokens ou dados privados do usuário.
- Dependências de produção/CI precisam ser fixadas; serviços externos devem ter alternativa/exportação e limite de custo.
- Segredo possivelmente exposto deve ser revogado/rotacionado; apagar do último commit não basta.

### Auditoria Supabase registrada

Na verificação anterior do projeto EDEN (setembro/2026), o Security Advisor não apresentava alertas ativos; as tabelas de negócio em `public` estavam com RLS habilitado e as políticas de dados pessoais eram vinculadas ao usuário autenticado. A função `handle_new_user` era a única função `SECURITY DEFINER` observada naquela consulta e não era executável por `anon`/usuários autenticados.

Isso é um registro histórico, não uma garantia do estado atual em 31/10/2026. Revalidar Advisor, RLS, policies, grants, funções e migrations antes de release.

## 6. CI e estado de validação conhecido

No commit `e34e8d6c62cf0aa9ff5b0ad16f8979f352a38352`, em 05/09/2026:

- Workflow **RUMO hardening contracts**: sucesso.
- Workflow **Validate RUMO**: sucesso.
- Status Vercel reportado pelo GitHub: sucesso.

Os contratos automatizados incluem verificações de sintaxe, invariantes de segurança, rotação do planejador, prioridade de revisão vencida, parser de sessão, proteção de endpoint destrutivo e comportamento do service worker. A documentação também exige smoke tests Chromium em desktop/mobile, estado limpo/persistido, estado local corrompido, Supabase degradado e regressão de XSS.

Não considerar esses resultados como teste recém-executado: a última execução confirmada aqui é de 05/09/2026. Rodar novamente na retomada.

## 7. Direção visual e responsabilidades

A v9 é o baseline visual protegido. Trabalho de backend, arquitetura e segurança não deve mudar silenciosamente layout, tipografia, cores, espaçamento, navegação ou interações.

O RUMO deve parecer inteligente, calmo, confiável, maduro e focado em direção/progresso — não um gerenciador genérico de tarefas ou um app gamificado.

**Anti-vibecoding / Impeccable Design / Design Engineering:**
- Não introduzir bento genérico, gradientes/glows decorativos, excesso de cards, sombras, cantos arredondados, cores arco-íris, emoji como ícones, animações sem função ou métricas falsas.
- Evitar microtexto e preservar legibilidade mobile.
- Loading, vazio, erro, sucesso e modo degradado devem ser estados reais e intencionais.
- Acessibilidade, semântica, desempenho e segurança podem melhorar sem redesenho não aprovado.
- Referências visuais futuras devem respeitar a direção EDEN e usar Cult UI, OriginKit e Skiper UI como referências, não como cópia automática.

**Divisão de trabalho acordada:**
- Natanael: direção de UI/UX e testes visuais/funcionais.
- Assistente: programação, arquitetura, backend, segurança, análise de regressão e documentação técnica.
- Não pedir ao usuário para executar trabalho que possa ser feito com os recursos conectados; parar apenas quando houver dependência real de decisão, credencial, aprovação visual ou teste humano.

## 8. Bom + Bonito + Barato e limites de custo

- Cloud-only: nenhuma função essencial pode depender do PC do usuário permanecer ligado.
- Free/open-source primeiro; evitar lock-in e manter dados exportáveis.
- A linha estável deve continuar útil com custo recorrente de R$0 sempre que possível.
- Não ativar IA paga, OCR em servidor, push, billing ou APIs de terceiros como dependência oculta.
- Qualquer recurso pago exige justificativa, análise de custo, limite de uso, tratamento de falha e alternativa.
- O código pós-v9 em `master` contém módulos adicionais de billing/Mercado Pago, R2, push, administração de conteúdo e integrações. A presença desses arquivos não significa que estejam prontos para produção nem que devam ser ativados.

## 9. Próxima sequência de trabalho

1. Retomar pela branch `rumo-v9-product-hardening`, nunca pelo `master` sem comparação.
2. Confirmar o estado atual da branch, deploy e workflows.
3. Reexecutar a regressão da v9 em desktop e mobile.
4. Conferir migrations aplicadas no Supabase versus migrations versionadas.
5. Revalidar Security Advisor, RLS, policies, grants, funções e permissões de Storage.
6. Auditar todas as inserções HTML dinâmicas e dados externos (Radar, edital, catálogo e estado local) para XSS/injeção.
7. Revisar autenticação, sessão, exportação e exclusão de conta em sucesso e falha.
8. Verificar service worker: cache somente de shell/estáticos; nunca dados pessoais ou respostas privadas.
9. Rodar CI e smoke tests Chromium completos; registrar resultado e commit.
10. Só então priorizar productização funcional. Mudanças visuais ficam aguardando validação do responsável por UI/UX.

## 10. Links e referências de código

- Repositório: https://github.com/QuartaFeiraa/EDEN-explorer
- Baseline v9: https://github.com/QuartaFeiraa/EDEN-explorer/commit/139c11530f6a8acf4b7c075ab19c3c05226fd9e4
- Branch de hardening: https://github.com/QuartaFeiraa/EDEN-explorer/tree/rumo-v9-product-hardening
- Commit da branch de hardening: https://github.com/QuartaFeiraa/EDEN-explorer/commit/e34e8d6c62cf0aa9ff5b0ad16f8979f352a38352
- Snapshot master: https://github.com/QuartaFeiraa/EDEN-explorer/commit/910889bab2f0762f644f98a46688532f919faa6d

---

**Regra final:** preservar o que funciona, entender antes de alterar, fazer mudanças pequenas e reversíveis, testar os caminhos de sucesso e de falha e nunca confundir “código presente” com “recurso pronto para produção”.
