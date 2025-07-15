/* -------------------------------------------------------------------------- */
/*  src/features/items/AddItemModal.tsx                                       */
/* -------------------------------------------------------------------------- */
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PhotoIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import clsx from 'clsx';

import useCategories, { Category } from '../categories/useCategories';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../api';

/* -------------------------------------------------------------------------- */
/*                               schema + types                               */
/* -------------------------------------------------------------------------- */

const MB = 1024 * 1024;
const MAX_IMAGES = 6;

const priceRegex = /^\d+([.,]\d{1,2})?$/; // hasta 2 decimales

const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().max(500).optional(),
  price_per_h: z
    .string()
    .regex(priceRegex, 'Precio inválido')
    .transform(v => Number(v.replace(',', '.'))),
  categories: z.array(z.number()).min(1, 'Selecciona al menos una categoría'),
  images: z
    .array(
      z
        .instanceof(File)
        .refine(f => f.size <= 5 * MB, 'Cada imagen máx. 5 MB')
    )
    .min(1, 'Al menos 1 imagen')
    .max(MAX_IMAGES, `Máx. ${MAX_IMAGES} imágenes`)
});

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // callback para refrescar listado
};

/* -------------------------------------------------------------------------- */
/*                           Componente principal                             */
/* -------------------------------------------------------------------------- */
export default function AddItemModal({ open, onClose, onCreated }: Props) {
  const { data: cats } = useCategories();
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { categories: [], images: [] }
  });

  /* --------------------------- previews dinámicos -------------------------- */
  const files = watch('images'); // File[]
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL); // cleanup
  }, [files]);

  /* ------------------------------- submit --------------------------------- */
  async function onSubmit(data: FormData) {
    if (!token) {
      toast.error('Debes haber iniciado sesión');
      return;
    }

    try {
      /* 1.- subimos imágenes (paralelo) */
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

      /* 2.- creamos ítem */
      await api.post('/items/', {
        name: data.name,
        description: data.description,
        price_per_h: data.price_per_h,
        categories: data.categories,
        image_urls           // 🔥 ahora array
      });

      toast.success('¡Producto publicado!');
      reset();
      onCreated();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail ?? 'Error al crear producto');
    }
  }

  /* ------------------------------------------------------------------------ */
  /*                                   UI                                     */
  /* ------------------------------------------------------------------------ */
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        onClose={() => {
          reset();
          onClose();
        }}
        className="relative z-50"
      >
        {/* ---------- Backdrop con mejor transición ---------- */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md dark:bg-black/70" />
        </Transition.Child>

        {/* ---------- Wrapper con max-width responsive ---------- */}
        <div className="fixed inset-0 grid place-items-center p-4 sm:p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="flex w-full max-w-lg sm:max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800 dark:shadow-gray-900 transition-all">
              {/* ---------- Header con mejor tipografía y dark mode ---------- */}
              <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Nuevo producto
                </Dialog.Title>
                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand dark:text-gray-400 dark:hover:bg-gray-700"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </header>

              {/* ---------- Form (scrollable, grid responsive) ---------- */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto px-6 py-8 sm:grid-cols-2"
              >
                {/* --------------------------- Columna 1 --------------------------- */}
                <div className="space-y-6">
                  {/* Nombre con label flotante */}
                  <div className="relative">
                    <input
                      {...register('name')}
                      id="name"
                      className="peer form-input w-full rounded-lg border-gray-300 text-gray-900 placeholder-transparent focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand"
                      placeholder="Nombre del producto"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-brand dark:bg-gray-800 dark:text-gray-400"
                    >
                      Nombre
                    </label>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="inline-block h-3 w-3 rounded-full bg-red-100 text-center text-red-600 dark:bg-red-900 dark:text-red-200">!</span>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Descripción con resize y counter */}
                  <div className="relative">
                    <textarea
                      {...register('description')}
                      id="description"
                      rows={4}
                      className="peer form-input w-full rounded-lg border-gray-300 text-gray-900 placeholder-transparent focus:border-brand focus:ring-brand resize-y dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand"
                      placeholder="Descripción detallada"
                    />
                    <label
                      htmlFor="description"
                      className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-brand dark:bg-gray-800 dark:text-gray-400"
                    >
                      Descripción
                    </label>
                    <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                      {watch('description')?.length ?? 0}/500
                    </span>
                    {errors.description && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="inline-block h-3 w-3 rounded-full bg-red-100 text-center text-red-600 dark:bg-red-900 dark:text-red-200">!</span>
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Precio con icono € */}
                  <div className="relative">
                    <input
                      {...register('price_per_h')}
                      id="price"
                      className="peer form-input w-full rounded-lg border-gray-300 pl-8 text-gray-900 placeholder-transparent focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-brand"
                      placeholder="Precio por hora"
                      inputMode="decimal"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">€</span>
                    <label
                      htmlFor="price"
                      className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-brand dark:bg-gray-800 dark:text-gray-400"
                    >
                      Precio / hora
                    </label>
                    {errors.price_per_h && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="inline-block h-3 w-3 rounded-full bg-red-100 text-center text-red-600 dark:bg-red-900 dark:text-red-200">!</span>
                        {errors.price_per_h.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* --------------------------- Columna 2 --------------------------- */}
                <div className="space-y-6">
                  {/* Imágenes con drop zone mejorada y previews en grid */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Imágenes ({files.length}/{MAX_IMAGES})
                    </label>

                    {/* zona de drop / input con hover y focus */}
                    <label className="mt-2 flex min-h-[8rem] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500 transition-all hover:border-brand hover:bg-brand/5 hover:text-brand focus:border-brand focus:ring-2 focus:ring-brand dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:border-brand dark:hover:bg-brand/10">
                      <PhotoIcon className="h-10 w-10 mb-2" />
                      <span className="font-medium">Haz clic o arrastra archivos aquí</span>
                      <span className="text-xs mt-1">PNG, JPG · máx. 5 MB c/u · hasta {MAX_IMAGES}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={e =>
                          setValue(
                            'images',
                            [...(e.target.files ?? [])] as File[],
                            { shouldValidate: true }
                          )
                        }
                      />
                    </label>

                    {/* previews en grid responsive con hover remove */}
                    {previews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {previews.map((src, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={src}
                              alt={`preview ${i + 1}`}
                              className="h-28 w-full rounded-lg object-cover transition-transform group-hover:scale-105"
                            />
                            <button
                              type="button"
                              title="Eliminar"
                              onClick={() => {
                                const copy = [...files];
                                copy.splice(i, 1);
                                setValue('images', copy, { shouldValidate: true });
                              }}
                              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <TrashIcon className="h-8 w-8 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.images && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="inline-block h-3 w-3 rounded-full bg-red-100 text-center text-red-600 dark:bg-red-900 dark:text-red-200">!</span>
                        {errors.images.message as string}
                      </p>
                    )}
                  </div>

                  {/* Categorías como chips con hover */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Categorías</p>
                    <div className="flex flex-wrap gap-2">
                      {cats.map((c: Category) => {
                        const selected = watch('categories').includes(c.id);
                        return (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => {
                              const current = new Set(watch('categories'));
                              selected
                                ? current.delete(c.id)
                                : current.add(c.id);
                              setValue('categories', [...current]);
                            }}
                            className={clsx(
                              'rounded-full px-4 py-1 text-sm font-medium transition-all',
                              selected
                                ? 'bg-brand text-white shadow-md hover:shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            )}
                          >
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                    {errors.categories && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="inline-block h-3 w-3 rounded-full bg-red-100 text-center text-red-600 dark:bg-red-900 dark:text-red-200">!</span>
                        {errors.categories.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* --------------------------- Footer --------------------------- */}
                <div className="sm:col-span-2 flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    className="btn--ghost px-6 py-3 rounded-lg text-sm font-medium transition-all hover:shadow-md dark:hover:bg-gray-700"
                    onClick={() => {
                      reset();
                      onClose();
                    }}
                  >
                    Cancelar
                  </button>
                  <button className="btn px-6 py-3 rounded-lg text-sm font-medium flex items-center justify-center" disabled={isSubmitting}>
                    {isSubmitting ? (
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}