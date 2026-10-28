-- Dados de teste
-- Todos os usuários têm a senha Senha@123 (o valor abaixo é o hash bcrypt dela)

INSERT INTO unidades (nome, cidade, uf) VALUES
  ('Raízes Boa Viagem', 'Recife', 'PE'),     -- id 1, cozinha completa
  ('Raízes Aldeota', 'Fortaleza', 'CE');     -- id 2, cozinha reduzida

INSERT INTO produtos (nome, descricao, categoria, preco, ativo) VALUES
  ('Tapioca de carne de sol', NULL, 'Tapiocas', 18.90, true),             -- id 1
  ('Cuscuz recheado', 'Cuscuz com queijo coalho e ovo', 'Cuscuz', 16.50, true), -- id 2
  ('Bolo de macaxeira', NULL, 'Bolos', 9.90, true),                       -- id 3
  ('Suco de cajá', NULL, 'Bebidas', 8.00, true),                          -- id 4
  ('Café coado', NULL, 'Bebidas', 5.50, true),                            -- id 5
  ('Canjica', NULL, 'Juninos', 12.00, false);                             -- id 6, fora de época

INSERT INTO estoques (unidade_id, produto_id, quantidade) VALUES
  (1, 1, 30),
  (1, 2, 25),
  (1, 3, 2),
  (1, 4, 40),
  (1, 5, 100),
  (1, 6, 10),
  -- a unidade de Fortaleza não trabalha com tapioca nem cuscuz
  (2, 3, 15),
  (2, 4, 20),
  (2, 5, 60);

INSERT INTO usuarios (nome, email, senha_hash, perfil, unidade_id, consentimento_fidelidade, consentimento_em) VALUES
  ('Admin Matriz', 'admin@raizes.com', '$2b$10$Nom1OuhteLmv.MPT6pIn..TVjrx6PH5QuSFEzCYjpB0MHLx0S28fK', 'ADMIN', NULL, false, NULL),
  ('Carlos Gerente', 'gerente.recife@raizes.com', '$2b$10$Nom1OuhteLmv.MPT6pIn..TVjrx6PH5QuSFEzCYjpB0MHLx0S28fK', 'GERENTE', 1, false, NULL),
  ('Ana Atendente', 'atendente.recife@raizes.com', '$2b$10$Nom1OuhteLmv.MPT6pIn..TVjrx6PH5QuSFEzCYjpB0MHLx0S28fK', 'ATENDENTE', 1, false, NULL),
  ('José Cozinha', 'cozinha.recife@raizes.com', '$2b$10$Nom1OuhteLmv.MPT6pIn..TVjrx6PH5QuSFEzCYjpB0MHLx0S28fK', 'COZINHA', 1, false, NULL),
  ('Maria Silva', 'maria@exemplo.com', '$2b$10$Nom1OuhteLmv.MPT6pIn..TVjrx6PH5QuSFEzCYjpB0MHLx0S28fK', 'CLIENTE', NULL, true, now()),
  ('João Souza', 'joao@exemplo.com', '$2b$10$Nom1OuhteLmv.MPT6pIn..TVjrx6PH5QuSFEzCYjpB0MHLx0S28fK', 'CLIENTE', NULL, false, NULL);
