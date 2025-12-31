# Guia de Deploy na Vercel com Banco de Dados

Este guia explicará como colocar seu projeto online usando a Vercel e um banco de dados PostgreSQL (Vercel Postgres ou Neon).

## 1. Preparação do Projeto

### Banco de Dados
Atualmente o projeto usa SQLite, que não funciona na Vercel (pois o sistema de arquivos é temporário). Vamos mudar para PostgreSQL.

1.  Crie um projeto na [Vercel](https://vercel.com).
2.  Vá na aba "Storage" e crie um novo banco "Postgres".
3.  Após criado, copie as variáveis de ambiente (`POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, etc).
    *   Para facilitar, geralmente usamos apenas uma variável `DATABASE_URL` no projeto. Conecte o projeto Vercel ao seu repositório GitHub para ele puxar essas envs automaticamente, ou copie a string de conexão.

### Variáveis de Ambiente
Na Vercel, em Settings -> Environment Variables, adicione:
- `DATABASE_URL`: A URL do seu banco Postgres.
- `AUTH_SECRET`: Um código secreto para o NextAuth (gere um com `openssl rand -base64 32` ou use um gerador de senha forte).
- `NEXT_PUBLIC_APP_URL`: A URL do seu site (ex: `https://seu-projeto.vercel.app`).

## 2. Alterações no Código

Eu farei as alterações necessárias no `schema.prisma` para suportar PostgreSQL.

### Scripts
Adicionaremos um script `postinstall` no `package.json` para gerar o cliente do Prisma automaticamente durante o build na Vercel:
`"postinstall": "prisma generate"`

## 3. Deploy

1.  Envie seu código para o GitHub.
2.  Na Vercel, clique em "Import Project" e selecione seu repositório.
3.  Configure as variáveis de ambiente listadas acima.
4.  Clique em Deploy.
