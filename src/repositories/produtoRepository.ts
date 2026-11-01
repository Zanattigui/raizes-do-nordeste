import { pool } from "../db/pool";

type Produto = {
  id: number;
  nome: string;
  preco: number;
  ativo: boolean;
};

export async function buscarProdutoPorId(id: number) {
  const { rows } = await pool.query<Produto>(
    "SELECT id, nome, preco::float8 AS preco, ativo FROM produtos WHERE id = $1",
    [id],
  );
  return rows[0];
}
