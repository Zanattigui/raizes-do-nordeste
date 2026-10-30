import bcrypt from "bcryptjs";
import { AppError } from "../errors/appError";
import {
  buscarPorEmail,
  inserirCliente,
} from "../repositories/usuarioRepository";

interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
  consentimentoFidelidade?: boolean;
}

export async function cadastrarCliente(dados: DadosCadastro) {
  const existente = await buscarPorEmail(dados.email);
  if (existente) {
    throw new AppError(
      409,
      "EMAIL_JA_CADASTRADO",
      "Já existe um usuário com esse e-mail.",
    );
  }

  const senhaHash = await bcrypt.hash(dados.senha, 10);
  const consentiu = dados.consentimentoFidelidade === true;

  return inserirCliente({
    nome: dados.nome,
    email: dados.email,
    senhaHash,
    consentimentoFidelidade: consentiu,
    consentimentoEm: consentiu ? new Date() : null,
  });
}

export async function validarCredenciais(email: string, senha: string) {
  const usuario = await buscarPorEmail(email);

  // mesma mensagem para e-mail inexistente e senha errado para não revelar quais emails existem
  if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    throw new AppError(
      401,
      "CREDENCIAIS_INVALIDAS",
      "E-mail ou senha incorretos.",
    );
  }

  return usuario;
}
