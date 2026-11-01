import { PoolClient } from "pg";
import { pool } from "./pool";

// roda as queries numa transação: se alguma der erro, desfaz tudo (ROLLBACK)
export async function emTransacao<T>(
  funcao: (client: PoolClient) => Promise<T>,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const resultado = await funcao(client);
    await client.query("COMMIT");
    return resultado;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
