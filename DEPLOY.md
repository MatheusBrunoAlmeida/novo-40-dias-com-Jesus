# Guia de Deploy: Vercel + Neon (PostgreSQL)

Este guia contém o passo a passo específico para configurar seu projeto na **Vercel** usando o banco de dados **Neon.tech**.

## 1. Configuração no Neon.tech

1.  Crie uma conta em [neon.tech](https://neon.tech) e crie um novo projeto.
2.  No seu Dashboard do Neon, você verá uma seção "Connection Details".
3.  Você precisará de duas URLs:
    *   **Pooled Connection** (para a aplicação): Geralmente começa com `postgres://...` e tem `pgbouncer` ou similar na string, ou você seleciona a opção "Pooled".
    *   **Direct Connection** (para migrações): Selecione a opção "Direct" (ou desmarque "Pooled") para pegar a conexão direta.

## 2. Environment Variables na Vercel

Vá nas configurações do seu projeto na Vercel (Settings -> Environment Variables) e adicione:

| Variável | Valor | Descrição |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgres://...` (Sua URL **Pooled**) | Usada pela aplicação para alta performance. |
| `DIRECT_URL` | `postgres://...` (Sua URL **Direct**) | Usada pelo Prisma Migrate para fazer alterações no schema. |
| `AUTH_SECRET` | (Gere um hash seguro) | Segurança do NextAuth. Pode gerar com `openssl rand -base64 32`. |
| `NEXT_PUBLIC_APP_URL` | `https://seu-projeto.vercel.app` | URL final do seu site após o deploy (pode preencher depois do primeiro deploy ou usar a URL provisória). |

## 3. Preparando o Banco de Dados

Como estamos mudando de SQLite para Postgres, seu banco na nuvem estará vazio. O comando de deploy tentará rodar as migrações, mas é bom garantir que os arquivos de migração locais estão sincronizados.

Recomendação: Como você ainda não tem dados de produção importantes, podemos resetar as migrações para garantir compatibilidade total com Postgres.

No seu terminal local (antes de subir o código):
1.  Apague a pasta `prisma/migrations`.
2.  Delete o arquivo `prisma/dev.db` (se existir).
3.  Rode: `npx prisma migrate dev --name init`
    *   Isso vai falhar se você não tiver a `DATABASE_URL` do Neon configurada no seu `.env` local.
    *   **Opção Simples:** Apenas suba o código. O comando `postinstall` que configuramos (`prisma generate`) vai preparar o cliente. Para criar as tabelas no Neon, você pode rodar o comando migrate via Vercel ou conectar localmente.

**Melhor abordagem para o primeiro deploy:**
1.  Copie a **Direct Connection** do Neon.
2.  Cole no seu `.env` local como `DATABASE_URL` e `DIRECT_URL`.
3.  Rode `npx prisma migrate dev --name init` localmente. Isso cria as tabelas no Neon.
4.  Rode `npx prisma db seed` para criar o usuário admin no Neon.

## 4. Deploy

1.  Faça o commit e push das alterações (`git push`).
2.  A Vercel deve iniciar o deploy automaticamente.
3.  Acesse seu site!

---

**Resumo de variáveis no .env local para teste:**
```env
DATABASE_URL="postgres://...(pooled)..."
DIRECT_URL="postgres://...(direct)..."
```
