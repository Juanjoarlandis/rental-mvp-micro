import { api } from "../../api";

/**
 * Envía el nuevo password junto con el token recibido por “forgot”.
 * Lanza 400 si el token es inválido / expiró.
 */
export async function reset(token: string, newPassword: string): Promise<void> {
  await api.post("/auth/password/reset", { token, new_password: newPassword });
}
