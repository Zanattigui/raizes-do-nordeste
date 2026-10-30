import { FastifyInstance } from "fastify";
import { cadastrar, login } from "../controllers/authController";
import { cadastroSchema, loginSchema } from "../schemas/authSchema";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/cadastro", { schema: cadastroSchema }, cadastrar);
  app.post("/auth/login", { schema: loginSchema }, login);
}
