import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

import { addProductSchema, AddProductFormData } from './schema';
import ModalShell from './ModalShell';
import BasicInfoSection from './sections/BasicInfoSection';
import MediaSection from './sections/MediaSection';
import PricingSection from './sections/PricingSection';
import InventorySection from './sections/InventorySection';
import ShippingSection from './sections/ShippingSection';

import { api } from '../../../api';
import { useAuth } from '../../../hooks/useAuth';

type Props = {
  open: boolean;
  onClose(): void;
  onCreated(): void;
};

export default function AddProductModal({ open, onClose, onCreated }: Props) {
  const { token } = useAuth();

  const methods = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      categories: [],
      images: [],
      condition: 'new',
      hashtags: [],
      stock: 1,
      shipping_type: 'free'
    }
  });

async function onSubmit(data: AddProductFormData) {
  if (!token) {
    toast.error('Debes haber iniciado sesión');
    return;
  }

  try {
    /* 1. Subir imágenes */
    let image_urls: string[] = [];
    if (data.images.length) {
      const uploads = await Promise.all(
        data.images.map(async img => {
          const fd = new FormData();
          fd.append('file', img);
          const r = await api.post<{ url: string }>('/upload/', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          return r.data.url;
        })
      );
      image_urls = uploads;
    }

    /* 2. Construir payload coherente con la API */
    const payload = {
      name: data.name,
      description: data.description,
      price_per_h: data.price,           // 👈 se mapea
      compare_at_price: data.compare_at_price || undefined,
      categories: data.categories.length ? data.categories : undefined,
      image_urls,
      sku: data.sku || undefined,
      stock: data.stock,
      weight_kg: data.weight_kg,
      shipping_type: data.shipping_type,
      condition: data.condition,
      hashtags: data.hashtags.filter(Boolean)     // quita strings vacíos
    };

    await api.post('/items/', payload);

    toast.success('¡Producto publicado!');
    methods.reset();
    onCreated();
    onClose();
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.detail ?? 'Error al crear producto');
  }
}

  return (
    <ModalShell
      open={open}
      title="Nuevo producto"
      onClose={() => {
        methods.reset();
        onClose();
      }}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 overflow-y-auto px-6 py-8"
        >
          {/* Columna izquierda */}
          <div className="space-y-10">
            <BasicInfoSection />
            <MediaSection />
          </div>

          {/* Columna derecha */}
          <div className="space-y-10">
            <PricingSection />
            <InventorySection />
            <ShippingSection />
          </div>

          {/* Footer */}
          <div className="sm:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="btn--ghost px-6 py-3 rounded-lg text-sm font-medium transition-all hover:shadow-md dark:hover:bg-gray-700"
              onClick={() => {
                methods.reset();
                onClose();
              }}
            >
              Cancelar
            </button>
            <button
              className="btn px-6 py-3 rounded-lg text-sm font-medium flex items-center justify-center"
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting ? (
                <>
                  <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
                  Publicando…
                </>
              ) : (
                'Publicar'
              )}
            </button>
          </div>
        </form>
      </FormProvider>
    </ModalShell>
  );
}
