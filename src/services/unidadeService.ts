import { AppError } from "../errors/appError";
import {
  buscarUnidadePorId,
  listarCardapio,
  listarUnidades,
} from "../repositories/unidadeRepository";

export async function buscarUnidades() {
  return listarUnidades();
}

export async function buscarCardapio(unidadeId: number) {
  const unidade = await buscarUnidadePorId(unidadeId);
  if (!unidade) {
    throw new AppError(
      404,
      "UNIDADE_NAO_ENCONTRADA",
      "Unidade não encontrada.",
    );
  }

  const produtos = await listarCardapio(unidadeId);
  return { unidade, produtos };
}
