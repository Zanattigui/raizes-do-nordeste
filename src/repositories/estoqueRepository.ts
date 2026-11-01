import { PoolClient } from "pg";

// o FOR UPDATE trava a linha até o fim da transação,
// assim dois pedidos ao mesmo tempo não vendem o mesmo item
export async function buscarQuantidadeComTrava(
  client: PoolClient,
  unidadeId: number,
  produtoId: number,
) {
  const { rows } = await client.query<{ quantidade: number }>(
    `SELECT quantidade
       FROM estoques
      WHERE unidade_id = $1 AND produto_id = $2
      FOR UPDATE`,
    [unidadeId, produtoId],
  );
  return rows[0]?.quantidade ?? 0;
}

export async function baixarEstoque(
  client: PoolClient,
  unidadeId: number,
  produtoId: number,
  quantidade: number,
) {
  await client.query(
    `UPDATE estoques SET quantidade = quantidade - $3
      WHERE unidade_id = $1 AND produto_id = $2`,
    [unidadeId, produtoId, quantidade],
  );
}
