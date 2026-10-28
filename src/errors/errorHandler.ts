import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError, DetalheErro } from './appError'

function enviarErro(
  request: FastifyRequest,
  reply: FastifyReply,
  status: number,
  error: string,
  message: string,
  details: DetalheErro[] = [],
) {
  return reply.status(status).send({
    error,
    message,
    details,
    timestamp: new Date().toISOString(),
    path: request.url,
    requestId: request.id,
  })
}

export function errorHandler(err: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (err instanceof AppError) {
    return enviarErro(request, reply, err.statusCode, err.error, err.message, err.details)
  }

  // erro de validação do schema da rota
  if (err.validation) {
    const details = err.validation.map((v) => {
      const campo = v.keyword === 'required'
        ? String(v.params.missingProperty)
        : v.instancePath.replace(/^\//, '').replace(/\//g, '.')
      return { field: campo || 'body', issue: v.message ?? 'inválido' }
    })
    return enviarErro(request, reply, 400, 'DADOS_INVALIDOS', 'Um ou mais campos estão inválidos.', details)
  }

  // erros de token ausente, invalido ou expirado
  if (err.code?.startsWith('FST_JWT')) {
    return enviarErro(request, reply, 401, 'NAO_AUTENTICADO', 'Token ausente, inválido ou expirado.')
  }

  if (err.statusCode && err.statusCode < 500) {
    return enviarErro(request, reply, err.statusCode, 'REQUISICAO_INVALIDA', err.message)
  }

  request.log.error(err)
  return enviarErro(request, reply, 500, 'ERRO_INTERNO', 'Erro inesperado no servidor.')
}
