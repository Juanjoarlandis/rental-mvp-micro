/**
 * Modelos de dominio compartidos por todo el feature “items”.
 * Se ajustan 1‑a‑1 a la respuesta JSON del micro‑servicio Catálogo.
 */

export type Category = {
  id: number;
  name: string;
};

/* ---- listado (GET /items/) ------------------------------------------ */
export interface Item {
  id: number;
  name: string;
  description?: string;
  price_per_h: number;
  available: boolean;

  /* imágenes */
  image_url?: string;   // compat. legacy
  image_urls: string[]; // nuevas

  categories: Category[];
}

/* ---- detalle (GET /items/{id}) -------------------------------------- */
export interface ItemDetail extends Item {
  compare_at_price?: number | null;
  sku?: string | null;
  stock: number;
  weight_kg?: number | null;
  shipping_type: 'free' | 'local_pickup' | 'paid';
  condition: 'new' | 'used';
  hashtags: string[];
  owner_username: string;
}
