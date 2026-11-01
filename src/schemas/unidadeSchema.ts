export const listarUnidadesSchema = {
  tags: ["Unidades"],
  summary: "Lista as unidades da rede",
};

export const cardapioSchema = {
  tags: ["Unidades"],
  summary: "Cardápio da unidade (produtos ativos com estoque)",
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer" },
    },
  },
};
