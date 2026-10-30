import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { env } from "./config/env";
import { errorHandler } from "./errors/errorHandler";
import { authRoutes } from "./routes/authRoutes";

export function buildApp() {
  const app = fastify({ logger: true });

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "API Raízes do Nordeste",
        description:
          "Back-end da rede Raízes do Nordeste: cardápio, pedidos, estoque, pagamento e fidelidade.",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
      },
    },
  });
  app.register(fastifySwaggerUi, { routePrefix: "/docs" });

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: env.JWT_EXPIRES_IN },
  });

  app.register(authRoutes);

  app.setErrorHandler(errorHandler);

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: "ROTA_NAO_ENCONTRADA",
      message: `Rota ${request.method} ${request.url} não existe.`,
      details: [],
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.id,
    });
  });

  return app;
}
