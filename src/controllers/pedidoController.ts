import { FastifyReply, FastifyRequest } from "fastify";
import {
  buscarPedido,
  buscarPedidos,
  criarPedido,
  DadosPedido,
  FiltrosListagem,
} from "../services/pedidoService";

interface PedidoParams {
  id: number;
}

export async function criar(request: FastifyRequest, reply: FastifyReply) {
  const dados = request.body as DadosPedido;
  const pedido = await criarPedido(request.user, dados);
  return reply.status(201).send(pedido);
}

export async function listar(request: FastifyRequest, reply: FastifyReply) {
  const filtros = request.query as FiltrosListagem;
  const resultado = await buscarPedidos(request.user, filtros);
  return reply.send(resultado);
}

export async function detalhar(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as PedidoParams;
  const pedido = await buscarPedido(request.user, id);
  return reply.send(pedido);
}
