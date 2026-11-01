import { FastifyRequest } from "fastify";
import "@fastify/jwt";
import { AppError } from "../errors/appError";
import { Perfil } from "../repositories/usuarioRepository";

export type UsuarioToken = {
  id: number;
  perfil: Perfil;
  unidadeId: number | null;
};

// diz ao TypeScript o que vai dentro do token e o formato do request.user
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: UsuarioToken;
    user: UsuarioToken;
  }
}

// exige um token válido
export async function autenticar(request: FastifyRequest) {
  await request.jwtVerify();
}

// exige token válido e um dos perfis informados
export function autorizar(perfis: Perfil[]) {
  return async (request: FastifyRequest) => {
    await request.jwtVerify();
    if (!perfis.includes(request.user.perfil)) {
      throw new AppError(
        403,
        "SEM_PERMISSAO",
        "Seu perfil não tem acesso a esta operação.",
      );
    }
  };
}
