import { FastifyReply, FastifyRequest } from "fastify";
import { cadastrarCliente, validarCredenciais } from "../services/authService";

interface CadastroBody {
  nome: string;
  email: string;
  senha: string;
  consentimentoFidelidade?: boolean;
}

interface LoginBody {
  email: string;
  senha: string;
}

export async function cadastrar(request: FastifyRequest, reply: FastifyReply) {
  const dados = request.body as CadastroBody;
  const usuario = await cadastrarCliente(dados);
  return reply.status(201).send(usuario);
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, senha } = request.body as LoginBody;
  const usuario = await validarCredenciais(email, senha);

  const token = await reply.jwtSign({
    id: usuario.id,
    perfil: usuario.perfil,
    unidadeId: usuario.unidadeId,
  });

  return reply.send({
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      perfil: usuario.perfil,
      unidadeId: usuario.unidadeId,
    },
  });
}
