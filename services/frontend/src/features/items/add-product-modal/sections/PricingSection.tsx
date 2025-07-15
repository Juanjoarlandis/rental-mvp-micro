import { useFormContext } from 'react-hook-form';

export default function PricingSection() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <section className="space-y-6">
      {/* Precio */}
      <div className="relative">
        <input
          {...register('price')}
          id="price"
          placeholder="Precio"
          inputMode="decimal"
          className="peer form-input w-full rounded-lg border-gray-300 pl-8 placeholder-transparent focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700 dark:focus:border-brand"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          €
        </span>
        <label
          htmlFor="price"
          className="form-floating-label peer-placeholder-shown:form-floating-label--placeholder dark:bg-gray-800"
        >
          Precio
        </label>
        {errors.price && <p className="form-error">{errors.price.message}</p>}
      </div>

      {/* Precio comparado */}
      <div className="relative">
        <input
          {...register('compare_at_price')}
          id="compare"
          placeholder="Precio anterior (opcional)"
          inputMode="decimal"
          className="peer form-input w-full rounded-lg border-gray-300 pl-8 placeholder-transparent focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700 dark:focus:border-brand"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          €
        </span>
        <label
          htmlFor="compare"
          className="form-floating-label peer-placeholder-shown:form-floating-label--placeholder dark:bg-gray-800"
        >
          Precio anterior
        </label>
        {errors.compare_at_price && <p className="form-error">{errors.compare_at_price.message}</p>}
      </div>
    </section>
  );
}
