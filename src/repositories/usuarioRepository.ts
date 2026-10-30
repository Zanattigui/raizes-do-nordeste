import { pool } from "../db/pool";

export type Perfil = "CLIENTE" | "ATENDENTE" | "COZINHA" | "GERENTE" | "ADMIN";

type UsuarioLogin = {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  perfil: Perfil;
  unidadeId: number | null;
};

type NovoCliente = {
  nome: string;
  email: string;
  senhaHash: string;
  consentimentoFidelidade: boolean;
  consentimentoEm: Date | null;
};

export async function buscarPorEmail(email: string) {
  const { rows } = await pool.query<UsuarioLogin>(
    `SELECT id, nome, email, senha_hash AS "senhaHash", perfil, unidade_id AS "unidadeId"
       FROM usuarios
      WHERE email = $1`,
    [email],
  );
  return rows[0];
}

// o cadastro público sempre cria como CLIENTE (perfil fica com o default da tabela)
export async function inserirCliente(dados: NovoCliente) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, consentimento_fidelidade, consentimento_em)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nome, email, perfil, consentimento_fidelidade AS "consentimentoFidelidade", pontos`,
    [
      dados.nome,
      dados.email,
      dados.senhaHash,
      dados.consentimentoFidelidade,
      dados.consentimentoEm,
    ],
  );
  return rows[0];
}
