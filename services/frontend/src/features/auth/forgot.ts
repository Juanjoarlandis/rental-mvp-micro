import { api } from "../../api";

/**
 * Solicita el _reset_token_ para un usuario existente.
 * Devuelve el token si la operación fue correcta (404 si no existe).
 */
export async function forgot(username: string): Promise<string> {
  const { data } = await api.post<{ reset_token: string }>(
    "/auth/password/forgot",
    { username }
  );
  return data.reset_token;
}
