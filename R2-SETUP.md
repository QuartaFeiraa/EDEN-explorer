# Cloudflare R2 — EDEN RUMO

O RUMO usa o R2 como arquivo privado dos materiais originais. O navegador envia o PDF diretamente para o bucket por URL temporária; o arquivo não atravessa a função da Vercel.

## Bucket

Nome recomendado: `eden-rumo-materials`

Storage class: **Standard**.

Mantenha o bucket **privado**. O RUMO gera URLs pré-assinadas para upload e leitura.

## CORS

No bucket → Settings → CORS Policy, aplique o conteúdo de `r2-cors.json`.

## Token/API

Crie credenciais R2 com acesso apenas ao bucket do RUMO e permissão de leitura/escrita de objetos. Não exponha esses valores no navegador, GitHub, screenshots ou chat.

## Variáveis da Vercel

Configure como Production Secrets:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME` = `eden-rumo-materials`

O painel administrativo continua usando `CONTENT_ADMIN_SECRET` ou, enquanto ele não estiver configurado, `CRON_SECRET`.

## Uso

Abra `/admin-storage.html`, informe a chave administrativa da sessão e envie um ou vários PDFs.

Fluxo:

1. `/api/r2-presign` valida o pedido e gera uma URL PUT temporária.
2. O navegador envia o PDF diretamente ao R2.
3. `/api/content-admin` registra apenas nome, chave do objeto, tipo e tamanho em `content_assets` no Supabase.
4. Para abrir um material privado, o painel pede uma URL GET temporária ao `/api/r2-presign`.

## Segurança

- bucket privado;
- credenciais R2 somente server-side;
- URLs temporárias;
- RLS bloqueando acesso direto a `content_assets`;
- limite operacional inicial de 300 MB por PDF;
- o acervo bruto não deve ser publicado automaticamente aos alunos.
