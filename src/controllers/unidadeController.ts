import { FastifyReply, FastifyRequest } from "fastify";
import { buscarCardapio, buscarUnidades } from "../services/unidadeService";

interface UnidadeParams {
  id: number;
}

export async function listar(request: FastifyRequest, reply: FastifyReply) {
  const unidades = await buscarUnidades();
  return reply.send(unidades);
}

export async function cardapio(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as UnidadeParams;
  const resultado = await buscarCardapio(id);
  return reply.send(resultado);
}
