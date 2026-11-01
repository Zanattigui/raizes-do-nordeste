import { FastifyInstance } from "fastify";
import { cardapio, listar } from "../controllers/unidadeController";
import { cardapioSchema, listarUnidadesSchema } from "../schemas/unidadeSchema";

export async function unidadeRoutes(app: FastifyInstance) {
  app.get("/unidades", { schema: listarUnidadesSchema }, listar);
  app.get("/unidades/:id/cardapio", { schema: cardapioSchema }, cardapio);
}
