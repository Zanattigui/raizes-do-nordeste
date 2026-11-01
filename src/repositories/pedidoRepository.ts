import { PoolClient } from "pg";
import { pool } from "../db/pool";

const camposPedido = `id, unidade_id AS "unidadeId", cliente_id AS "clienteId",
  canal_pedido AS "canalPedido", status, desconto::float8 AS desconto,
  total::float8 AS total, created_at AS "criadoEm", updated_at AS "atualizadoEm"`;

type NovoPedido = {
  unidadeId: number;
  clienteId: number | null;
  canalPedido: string;
  total: number;
};

type NovoItem = {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
};

export type FiltrosPedido = {
  clienteId?: number;
  unidadeId?: number;
  canalPedido?: string;
  status?: string;
  pagina: number;
  limite: number;
};

export async function inserirPedido(client: PoolClient, dados: NovoPedido) {
  const { rows } = await client.query(
    `INSERT INTO pedidos (unidade_id, cliente_id, canal_pedido, total)
     VALUES ($1, $2, $3, $4)
     RETURNING ${camposPedido}`,
    [dados.unidadeId, dados.clienteId, dados.canalPedido, dados.total],
  );
  return rows[0];
}

export async function inserirItem(
  client: PoolClient,
  pedidoId: number,
  item: NovoItem,
) {
  await client.query(
    `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
     VALUES ($1, $2, $3, $4)`,
    [pedidoId, item.produtoId, item.quantidade, item.precoUnitario],
  );
}

export async function buscarPedidoPorId(id: number) {
  const { rows } = await pool.query(
    `SELECT ${camposPedido} FROM pedidos WHERE id = $1`,
    [id],
  );
  return rows[0];
}

export async function listarItens(pedidoId: number) {
  const { rows } = await pool.query(
    `SELECT i.produto_id AS "produtoId", p.nome, i.quantidade,
            i.preco_unitario::float8 AS "precoUnitario"
       FROM itens_pedido i
       JOIN produtos p ON p.id = i.produto_id
      WHERE i.pedido_id = $1
      ORDER BY i.id`,
    [pedidoId],
  );
  return rows;
}

export async function listarPedidos(filtros: FiltrosPedido) {
  // monta o WHERE só com os filtros que vieram
  const condicoes: string[] = [];
  const valores: (string | number)[] = [];

  if (filtros.clienteId) {
    valores.push(filtros.clienteId);
    condicoes.push(`cliente_id = $${valores.length}`);
  }
  if (filtros.unidadeId) {
    valores.push(filtros.unidadeId);
    condicoes.push(`unidade_id = $${valores.length}`);
  }
  if (filtros.canalPedido) {
    valores.push(filtros.canalPedido);
    condicoes.push(`canal_pedido = $${valores.length}`);
  }
  if (filtros.status) {
    valores.push(filtros.status);
    condicoes.push(`status = $${valores.length}`);
  }

  const where = condicoes.length ? `WHERE ${condicoes.join(" AND ")}` : "";

  const contagem = await pool.query<{ total: number }>(
    `SELECT count(*)::int AS total FROM pedidos ${where}`,
    valores,
  );

  const offset = (filtros.pagina - 1) * filtros.limite;
  const { rows } = await pool.query(
    `SELECT ${camposPedido} FROM pedidos ${where}
      ORDER BY id DESC
      LIMIT $${valores.length + 1} OFFSET $${valores.length + 2}`,
    [...valores, filtros.limite, offset],
  );

  return { total: contagem.rows[0].total, pedidos: rows };
}
