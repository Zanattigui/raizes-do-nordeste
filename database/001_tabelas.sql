-- Criação das tabelas da API Raízes do Nordeste

CREATE TYPE perfil AS ENUM ('CLIENTE', 'ATENDENTE', 'COZINHA', 'GERENTE', 'ADMIN');
CREATE TYPE canal_pedido AS ENUM ('APP', 'TOTEM', 'BALCAO', 'PICKUP', 'WEB');
CREATE TYPE status_pedido AS ENUM ('AGUARDANDO_PAGAMENTO', 'PAGO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE', 'CANCELADO');
CREATE TYPE forma_pagamento AS ENUM ('PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO');
CREATE TYPE status_pagamento AS ENUM ('APROVADO', 'RECUSADO');

CREATE TABLE unidades (
  id     SERIAL PRIMARY KEY,
  nome   VARCHAR(120) NOT NULL,
  cidade VARCHAR(80)  NOT NULL,
  uf     CHAR(2)      NOT NULL
);

CREATE TABLE usuarios (
  id                       SERIAL PRIMARY KEY,
  nome                     VARCHAR(120) NOT NULL,
  email                    VARCHAR(160) NOT NULL UNIQUE,
  senha_hash               VARCHAR(100) NOT NULL,
  perfil                   perfil       NOT NULL DEFAULT 'CLIENTE',
  unidade_id               INT REFERENCES unidades (id),
  consentimento_fidelidade BOOLEAN      NOT NULL DEFAULT false,
  consentimento_em         TIMESTAMP,
  pontos                   INT          NOT NULL DEFAULT 0,
  created_at               TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE produtos (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(120)  NOT NULL,
  descricao VARCHAR(300),
  categoria VARCHAR(40)   NOT NULL,
  preco     NUMERIC(10,2) NOT NULL,
  ativo     BOOLEAN       NOT NULL DEFAULT true
);

CREATE TABLE estoques (
  id         SERIAL PRIMARY KEY,
  unidade_id INT NOT NULL REFERENCES unidades (id),
  produto_id INT NOT NULL REFERENCES produtos (id),
  quantidade INT NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  UNIQUE (unidade_id, produto_id)
);

CREATE TABLE pedidos (
  id           SERIAL PRIMARY KEY,
  unidade_id   INT           NOT NULL REFERENCES unidades (id),
  cliente_id   INT REFERENCES usuarios (id),
  canal_pedido canal_pedido  NOT NULL,
  status       status_pedido NOT NULL DEFAULT 'AGUARDANDO_PAGAMENTO',
  desconto     NUMERIC(10,2) NOT NULL DEFAULT 0,
  total        NUMERIC(10,2) NOT NULL,
  created_at   TIMESTAMP     NOT NULL DEFAULT now(),
  updated_at   TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE INDEX idx_pedidos_canal_status ON pedidos (canal_pedido, status);

CREATE TABLE itens_pedido (
  id             SERIAL PRIMARY KEY,
  pedido_id      INT           NOT NULL REFERENCES pedidos (id) ON DELETE CASCADE,
  produto_id     INT           NOT NULL REFERENCES produtos (id),
  quantidade     INT           NOT NULL CHECK (quantidade > 0),
  preco_unitario NUMERIC(10,2) NOT NULL
);

CREATE TABLE pagamentos (
  id              SERIAL PRIMARY KEY,
  pedido_id       INT              NOT NULL REFERENCES pedidos (id),
  valor           NUMERIC(10,2)    NOT NULL,
  forma_pagamento forma_pagamento  NOT NULL,
  status          status_pagamento NOT NULL,
  created_at      TIMESTAMP        NOT NULL DEFAULT now()
);

CREATE TABLE logs_auditoria (
  id          SERIAL PRIMARY KEY,
  usuario_id  INT REFERENCES usuarios (id),
  acao        VARCHAR(60) NOT NULL,
  entidade    VARCHAR(40) NOT NULL,
  entidade_id INT,
  detalhes    JSONB,
  created_at  TIMESTAMP   NOT NULL DEFAULT now()
);
