import { FastifyInstance } from "fastify";
import { criar, detalhar, listar } from "../controllers/pedidoController";
import { autenticar, autorizar } from "../middlewares/autenticacao";
import {
  criarPedidoSchema,
  detalharPedidoSchema,
  listarPedidosSchema,
} from "../schemas/pedidoSchema";

const podeCriar = autorizar(["CLIENTE", "ATENDENTE", "GERENTE"]);

// onRequest roda antes da validação do body, então sem token já cai no 401
export async function pedidoRoutes(app: FastifyInstance) {
  app.post(
    "/pedidos",
    { schema: criarPedidoSchema, onRequest: podeCriar },
    criar,
  );
  app.get(
    "/pedidos",
    { schema: listarPedidosSchema, onRequest: autenticar },
    listar,
  );
  app.get(
    "/pedidos/:id",
    { schema: detalharPedidoSchema, onRequest: autenticar },
    detalhar,
  );
}
