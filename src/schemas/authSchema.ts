export const cadastroSchema = {
  tags: ["Auth"],
  summary: "Cadastro de cliente",
  body: {
    type: "object",
    required: ["nome", "email", "senha"],
    properties: {
      nome: { type: "string", minLength: 2 },
      email: { type: "string", format: "email" },
      senha: { type: "string", minLength: 6 },
      consentimentoFidelidade: { type: "boolean" },
    },
  },
};

export const loginSchema = {
  tags: ["Auth"],
  summary: "Login (retorna o token JWT)",
  body: {
    type: "object",
    required: ["email", "senha"],
    properties: {
      email: { type: "string", format: "email" },
      senha: { type: "string" },
    },
  },
};
