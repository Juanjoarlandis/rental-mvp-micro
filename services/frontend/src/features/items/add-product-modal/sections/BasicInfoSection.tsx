import { useFormContext } from 'react-hook-form';
import Chip from '../components/Chip';
import useCategories, { Category } from '../../../categories/useCategories';

export default function BasicInfoSection() {
  const { data: cats } = useCategories();
  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext();

  return (
    <section className="space-y-6">
      {/* Nombre */}
      <div className="relative">
        <input
          {...register('name')}
          id="name"
          placeholder="Nombre del producto"
          className="peer form-input w-full rounded-lg border-gray-300 placeholder-transparent focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700 dark:focus:border-brand"
        />
        <label
          htmlFor="name"
          className="form-floating-label peer-placeholder-shown:form-floating-label--placeholder dark:bg-gray-800"
        >
          Nombre
        </label>
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>

      {/* Descripción */}
      <div className="relative">
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          placeholder="Descripción detallada"
          className="peer form-input w-full resize-y rounded-lg border-gray-300 placeholder-transparent focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700 dark:focus:border-brand"
        />
        <label
          htmlFor="description"
          className="form-floating-label peer-placeholder-shown:form-floating-label--placeholder dark:bg-gray-800"
        >
          Descripción
        </label>
        <span className="absolute bottom-2 right-3 text-xs text-gray-400">
          {watch('description')?.length ?? 0}/500
        </span>
        {errors.description && <p className="form-error">{errors.description.message}</p>}
      </div>

      {/* Categorías */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Categorías</p>
        <div className="flex flex-wrap gap-2">
          {cats.map((c: Category) => {
            const selected = watch('categories').includes(c.id);
            return (
              <Chip
                key={c.id}
                selected={selected}
                onClick={() => {
                  const current = new Set(watch('categories'));
                  selected ? current.delete(c.id) : current.add(c.id);
                  setValue('categories', [...current]);
                }}
              >
                {c.name}
              </Chip>
            );
          })}
        </div>
        {errors.categories && <p className="form-error">{errors.categories.message}</p>}
      </div>

      {/* Estado */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Estado
        </label>
        <select
          {...register('condition')}
          className="form-select w-full rounded-lg border-gray-300 focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="new">Nuevo</option>
          <option value="used">Usado</option>
        </select>
        {errors.condition && <p className="form-error">{errors.condition.message}</p>}
      </div>
    </section>
  );
}
