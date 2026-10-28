export type DetalheErro = { field: string; issue: string }

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string,
    public details: DetalheErro[] = [],
  ) {
    super(message)
  }
}
