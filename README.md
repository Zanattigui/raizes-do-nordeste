# API Raízes do Nordeste

Back-end da rede de lanchonetes Raízes do Nordeste.

## Tecnologias

- Node.js 22 + TypeScript
- Fastify
- PostgreSQL 16 (com a biblioteca `pg`, SQL puro)
- Swagger (documentação)
- JWT + bcrypt (autenticação)
- Docker (banco de dados)

## Como rodar

Pré-requisitos: Node.js 22+ e Docker.

```bash
# 1. variáveis de ambiente
cp .env.example .env

# 2. dependências
npm install

# 3. sobe o banco (na primeira vez ele já cria as tabelas e os dados de teste)
npm run db:up

# 4. inicia a API
npm run dev
```

A API sobe em `http://localhost:3333` e a documentação fica em `http://localhost:3333/docs`.

## Banco de dados

Os scripts ficam na pasta `database/`:

- `001_tabelas.sql`: cria as tabelas
- `002_seed.sql`: insere os dados de teste

O Postgres do Docker executa esses arquivos sozinho quando o banco é criado pela primeira vez. Para apagar tudo e criar de novo:

```bash
npm run db:reset
```

## Usuários de teste

Todos com a senha `Senha@123`:

| E-mail | Perfil |
|---|---|
| admin@raizes.com | ADMIN |
| gerente.recife@raizes.com | GERENTE (unidade 1) |
| atendente.recife@raizes.com | ATENDENTE (unidade 1) |
| cozinha.recife@raizes.com | COZINHA (unidade 1) |
| maria@exemplo.com | CLIENTE (com fidelidade) |
| joao@exemplo.com | CLIENTE (sem fidelidade) |
