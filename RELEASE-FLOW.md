# Release Flow

O EDEN RUMO usa o seguinte fluxo:

1. Alterações entram em `staging`.
2. GitHub Actions executa validação de arquitetura, dependências e browser smoke.
3. `staging` não gera Preview automático na Vercel, evitando consumir o limite do plano Hobby.
4. Um pull request aprovado segue para `master`.
5. `master` publica em Production na Vercel.

Regra operacional: **PROGRAME → VERIFIQUE → MELHORE → APERFEIÇOE.**
