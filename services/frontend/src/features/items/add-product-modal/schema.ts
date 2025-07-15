import { z } from 'zod';

const MB = 1024 * 1024;
export const MAX_IMAGES = 10;

export const priceRegex = /^\d+([.,]\d{1,2})?$/;

export const addProductSchema = z.object({
  // Información básica
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().max(500).optional(),
  categories: z.array(z.number()).min(1, 'Selecciona al menos una categoría'),
  condition: z.enum(['new', 'used']),
  hashtags: z.array(z.string()).max(5, 'Máx. 5 hashtags'),

  // Media
  images: z
    .array(
      z
        .instanceof(File)
        .refine(f => f.size <= 5 * MB, 'Cada imagen máx. 5 MB')
    )
    .min(1, 'Al menos 1 imagen')
    .max(MAX_IMAGES, `Máx. ${MAX_IMAGES} imágenes`),

  // Pricing
  price: z
    .string()
    .regex(priceRegex, 'Precio inválido')
    .transform(v => Number(v.replace(',', '.'))),
  compare_at_price: z
    .string()
    .regex(priceRegex, 'Precio inválido')
    .transform(v => (v ? Number(v.replace(',', '.')) : undefined))
    .optional(),

  // Inventory
  sku: z.string().max(40).optional(),
  stock: z.number().int().min(0).default(1),

  // Shipping
  weight_kg: z
    .string()
    .regex(priceRegex, 'Número inválido')
    .transform(v => Number(v.replace(',', '.'))),
  shipping_type: z.enum(['free', 'local_pickup', 'paid'])
});

export type AddProductFormData = z.infer<typeof addProductSchema>;
