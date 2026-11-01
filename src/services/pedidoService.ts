import { emTransacao } from "../db/transacao";
import { AppError } from "../errors/appError";
import { UsuarioToken } from "../middlewares/autenticacao";
import {
  baixarEstoque,
  buscarQuantidadeComTrava,
} from "../repositories/estoqueRepository";
import {
  buscarPedidoPorId,
  FiltrosPedido,
  inserirItem,
  inserirPedido,
  listarItens,
  listarPedidos,
} from "../repositories/pedidoRepository";
import { buscarProdutoPorId } from "../repositories/produtoRepository";
import { buscarUnidadePorId } from "../repositories/unidadeRepository";

export interface DadosPedido {
  unidadeId: number;
  canalPedido: string;
  itens: { produtoId: number; quantidade: number }[];
}

export interface FiltrosListagem {
  canalPedido?: string;
  status?: string;
  pagina: number;
  limite: number;
}

export async function criarPedido(usuario: UsuarioToken, dados: DadosPedido) {
  const unidade = await buscarUnidadePorId(dados.unidadeId);
  if (!unidade) {
    throw new AppError(
      404,
      "UNIDADE_NAO_ENCONTRADA",
      "Unidade não encontrada.",
    );
  }

  // funcionário só abre pedido na própria unidade e o pedido fica sem cliente (balcão)
  let clienteId: number | null = usuario.id;
  if (usuario.perfil !== "CLIENTE") {
    if (usuario.unidadeId !== dados.unidadeId) {
      throw new AppError(
        403,
        "UNIDADE_NAO_PERMITIDA",
        "Você só pode abrir pedidos na sua unidade.",
      );
    }
    clienteId = null;
  }

  return emTransacao(async (client) => {
    const itens = [];
    let total = 0;

    for (const item of dados.itens) {
      const produto = await buscarProdutoPorId(item.produtoId);
      if (!produto || !produto.ativo) {
        throw new AppError(
          404,
          "PRODUTO_NAO_ENCONTRADO",
          `Produto ${item.produtoId} não encontrado.`,
          [
            {
              field: "produtoId",
              issue: `não existe produto ativo com id ${item.produtoId}`,
            },
          ],
        );
      }

      const disponivel = await buscarQuantidadeComTrava(
        client,
        dados.unidadeId,
        item.produtoId,
      );
      if (disponivel < item.quantidade) {
        throw new AppError(
          409,
          "ESTOQUE_INSUFICIENTE",
          `Não há estoque suficiente de ${produto.nome} nesta unidade.`,
          [{ field: "quantidade", issue: `disponível: ${disponivel}` }],
        );
      }

      await baixarEstoque(
        client,
        dados.unidadeId,
        item.produtoId,
        item.quantidade,
      );

      // o preço fica gravado no item, se o produto mudar de preço depois o pedido não muda
      itens.push({ ...item, nome: produto.nome, precoUnitario: produto.preco });
      total += produto.preco * item.quantidade;
    }

    const pedido = await inserirPedido(client, {
      unidadeId: dados.unidadeId,
      clienteId,
      canalPedido: dados.canalPedido,
      total: Math.round(total * 100) / 100,
    });

    for (const item of itens) {
      await inserirItem(client, pedido.id, item);
    }

    return { ...pedido, itens };
  });
}

export async function buscarPedidos(
  usuario: UsuarioToken,
  filtros: FiltrosListagem,
) {
  // cliente vê só os pedidos dele, funcionário só os da unidade, admin vê todos
  const escopo: FiltrosPedido = { ...filtros };
  if (usuario.perfil === "CLIENTE") {
    escopo.clienteId = usuario.id;
  } else if (usuario.perfil !== "ADMIN") {
    escopo.unidadeId = usuario.unidadeId ?? undefined;
  }

  const { total, pedidos } = await listarPedidos(escopo);
  return { pagina: filtros.pagina, limite: filtros.limite, total, pedidos };
}

export async function buscarPedido(usuario: UsuarioToken, id: number) {
  const pedido = await buscarPedidoPorId(id);

  // se o pedido for de outra pessoa ou de outra unidade, responde como se não existisse
  const podeVer =
    pedido &&
    (usuario.perfil === "ADMIN" ||
      (usuario.perfil === "CLIENTE" && pedido.clienteId === usuario.id) ||
      (usuario.perfil !== "CLIENTE" && pedido.unidadeId === usuario.unidadeId));

  if (!podeVer) {
    throw new AppError(404, "PEDIDO_NAO_ENCONTRADO", "Pedido não encontrado.");
  }

  const itens = await listarItens(id);
  return { ...pedido, itens };
}
