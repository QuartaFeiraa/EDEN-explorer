# EDEN RUMO — Release flow

A branch `staging` é validada pelo GitHub Actions e não gera Preview automático na Vercel. A produção é publicada somente a partir de `master`, depois do gate de CI.

Fluxo: staging → CI → pull request → CI → master → Vercel Production.
