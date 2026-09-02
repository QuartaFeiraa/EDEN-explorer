# Privacidade — EDEN RUMO (beta estável)

Última revisão: 2 de setembro de 2026.

Este documento descreve o comportamento técnico da versão estável atual do RUMO. Ele deve ser revisado novamente antes de qualquer lançamento comercial amplo.

## Princípio

O RUMO é local-first e coleta apenas o necessário para entregar planejamento e histórico de estudos. A versão estável atual não possui SDK de anúncios e não possui fluxo ativo de venda de dados pessoais.

## Uso sem conta

Parte do RUMO pode funcionar como visitante. Preferências e objetivo de visitante ficam no armazenamento local do navegador. Esses dados podem ser apagados pelo próprio navegador e não são uma conta em nuvem.

## Uso com conta

Quando a pessoa entra em uma conta, dados de estudo podem ser sincronizados no Supabase, incluindo perfil, objetivo, concurso escolhido, matérias/tópicos, plano, sessões, revisões, caderno de erros e preferências. O frontend usa uma chave Supabase publicável; acesso aos dados pessoais é protegido por Row Level Security e grants mínimos no banco.

## Editais em PDF

Na versão estável atual, a leitura do PDF acontece no navegador. O arquivo bruto não é enviado pelo fluxo de importação atual. Quando a pessoa está autenticada, a estrutura extraída necessária ao produto (como matérias, tópicos e metadados da importação) pode ser salva na conta.

## Assistente

O assistente da baseline v9 é local/contextual e não depende de uma API paga de modelo de linguagem. Uma integração externa de IA só poderá ser ativada depois de revisão específica de privacidade, segurança e custo.

## Exportação e exclusão

Pessoas autenticadas podem exportar os dados acessíveis da própria conta em JSON. A exclusão de conta exige confirmação explícita e é processada por uma função de backend autenticada. Se houver uma assinatura externa ativa ou arquivos de Storage que impeçam exclusão segura, o processo falha fechado em vez de apagar parcialmente a conta.

A exclusão remove os registros ativos relacionados por meio das relações do banco e remove o usuário de autenticação. Tokens de acesso já emitidos são JWTs de curta duração e podem continuar criptograficamente válidos até expirar; por isso operações sensíveis devem continuar validando o estado da sessão quando necessário. Cópias de infraestrutura e backups, quando existentes, seguem as janelas de retenção dos provedores.

## Provedores técnicos atuais

- Supabase: autenticação e banco de dados.
- Vercel: hospedagem e funções server-side.
- Google Fonts e jsDelivr: recursos estáticos usados pela interface/importador. Requisições a esses provedores podem expor dados técnicos normais de conexão, como IP e user-agent.

## Segurança

Segredos administrativos não são enviados ao navegador. O projeto mantém CI, RLS, grants mínimos, validação de conteúdo remoto e uma política de falha fechada para operações privilegiadas. Consulte `SECURITY.md` para o contrato técnico de segurança.

## Mudanças futuras

Pagamentos, IA externa, notificações, OCR em servidor ou outros provedores só devem ser adicionados depois de atualizar este documento e os controles correspondentes.
