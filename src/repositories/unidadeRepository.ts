import { pool } from "../db/pool";

export async function listarUnidades() {
  const { rows } = await pool.query(
    "SELECT id, nome, cidade, uf FROM unidades ORDER BY id",
  );
  return rows;
}

export async function buscarUnidadePorId(id: number) {
  const { rows } = await pool.query(
    "SELECT id, nome, cidade, uf FROM unidades WHERE id = $1",
    [id],
  );
  return rows[0];
}

// produtos ativos que ainda têm estoque na unidade
export async function listarCardapio(unidadeId: number) {
  const { rows } = await pool.query(
    `SELECT p.id, p.nome, p.descricao, p.categoria, p.preco::float8 AS preco
       FROM estoques e
       JOIN produtos p ON p.id = e.produto_id
      WHERE e.unidade_id = $1
        AND p.ativo = true
        AND e.quantidade > 0
      ORDER BY p.categoria, p.nome`,
    [unidadeId],
  );
  return rows;
}
