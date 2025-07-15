import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useFormContext } from 'react-hook-form';
import { MAX_IMAGES } from '../schema';
import useImagePreviews from '../hooks/useImagePreviews';

export default function MediaSection() {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const files: File[] = watch('images') || [];
  const previews = useImagePreviews(files);

  return (
    <section className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Imágenes ({files.length}/{MAX_IMAGES})
      </label>

      {/* Zona de drop */}
      <label className="drop-zone">
        <PhotoIcon className="h-10 w-10 mb-2" />
        <span className="font-medium">Haz clic o arrastra archivos aquí</span>
        <span className="text-xs mt-1">PNG/JPG · máx. 5 MB · hasta {MAX_IMAGES}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={e =>
            setValue('images', [...(e.target.files ?? [])] as File[], { shouldValidate: true })
          }
        />
      </label>

      {/* Previews */}
      {!!previews.length && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative group">
              <img
                src={src}
                alt={`preview-${i}`}
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

      {errors.images && <p className="form-error">{errors.images.message as string}</p>}
    </section>
  );
}
