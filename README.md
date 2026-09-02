# EDEN RUMO

RUMO é o produto de estudos e concursos da família EDEN. Esta linha de desenvolvimento evolui a partir do **RUMO v9 Stable**, preservando os fluxos já comprovados e adicionando produto, backend e segurança de forma incremental.

## Baseline de estabilidade

- Golden baseline: commit `139c11530f6a8acf4b7c075ab19c3c05226fd9e4` (`RUMO v9 Stable`).
- Branch de productização segura: `rumo-v9-product-hardening`.
- Não fazer merge desta branch sobre `master` de forma cega: o `master` contém uma linha pós-v9 diferente. A integração deve ser seletiva e testada.
- O visual aprovado do v9 é tratado como comportamento a preservar; mudanças de backend/segurança não devem redesenhar a interface.

## Princípios

**Bom + Bonito + Barato**: cloud-only, free/open-source primeiro, local-first quando fizer sentido, sem dependência desnecessária de fornecedor e com degradação segura quando serviços opcionais falham.

Segurança e anti-vibecoding são contratos do repositório, não etapas finais. Leia `SECURITY.md` e `ARCHITECTURE.md` antes de alterar autenticação, dados, billing, Radar, IA, storage ou jobs agendados.

## Stack atual

- Frontend: HTML, CSS e JavaScript modular, sem framework obrigatório.
- Auth e dados: Supabase Auth + Postgres + RLS + grants mínimos.
- Funções server-side: Vercel Functions somente quando a operação exige segredo ou execução confiável.
- PWA: manifesto existente; nenhuma estratégia de cache agressiva é habilitada por padrão.
- Assistente do v9: lógica local/contextual, sem custo obrigatório de API externa.

## Gate de release

GitHub Actions valida sintaxe, arquitetura v9, invariantes de segurança e smoke tests reais em Chromium: estado limpo, estado persistido, localStorage corrompido, Supabase indisponível, mobile, Radar, Essenciais, History e payloads maliciosos de XSS/URL/status.

Uma alteração com teste vermelho não é candidata a release.

## Dados do usuário

O RUMO oferece exportação local em JSON e uma rota autenticada para exclusão permanente de conta. A exclusão falha de forma segura quando há assinatura de provedor ainda ativa. Dados pessoais usam integridade referencial com `auth.users`; registros técnicos de pagamento preservados perdem o vínculo direto com o usuário quando aplicável.

## Estado de cobrança

A linha estável continua tratada como beta gratuito. Código de billing ou provedores de pagamento não deve ser ativado apenas porque existe no histórico do repositório; precisa passar por idempotência, reconciliação, webhook retry e revisão de segurança antes de produção.
