const canais = ["APP", "TOTEM", "BALCAO", "PICKUP", "WEB"];
const status = [
  "AGUARDANDO_PAGAMENTO",
  "PAGO",
  "EM_PREPARO",
  "PRONTO",
  "ENTREGUE",
  "CANCELADO",
];

// faz o Swagger mandar o token nessas rotas
const comToken = [{ bearerAuth: [] }];

export const criarPedidoSchema = {
  tags: ["Pedidos"],
  summary: "Cria um pedido",
  security: comToken,
  body: {
    type: "object",
    required: ["unidadeId", "canalPedido", "itens"],
    properties: {
      unidadeId: { type: "integer" },
      canalPedido: { type: "string", enum: canais },
      itens: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["produtoId", "quantidade"],
          properties: {
            produtoId: { type: "integer" },
            quantidade: { type: "integer", minimum: 1 },
          },
        },
      },
    },
  },
};

export const listarPedidosSchema = {
  tags: ["Pedidos"],
  summary: "Lista pedidos com filtro por canal e status",
  security: comToken,
  querystring: {
    type: "object",
    properties: {
      canalPedido: { type: "string", enum: canais },
      status: { type: "string", enum: status },
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 50, default: 10 },
    },
  },
};

export const detalharPedidoSchema = {
  tags: ["Pedidos"],
  summary: "Detalhe do pedido com os itens",
  security: comToken,
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer" },
    },
  },
};
