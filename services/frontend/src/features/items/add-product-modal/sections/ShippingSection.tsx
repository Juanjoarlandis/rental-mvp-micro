import { useFormContext } from 'react-hook-form';

export default function ShippingSection() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <section className="space-y-6">
      {/* Peso */}
      <div className="relative">
        <input
          {...register('weight_kg')}
          id="weight"
          placeholder="Peso (kg)"
          inputMode="decimal"
          className="peer form-input w-full rounded-lg border-gray-300 placeholder-transparent focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700 dark:focus:border-brand"
        />
        <label
          htmlFor="weight"
          className="form-floating-label peer-placeholder-shown:form-floating-label--placeholder dark:bg-gray-800"
        >
          Peso (kg)
        </label>
        {errors.weight_kg && <p className="form-error">{errors.weight_kg.message}</p>}
      </div>

      {/* Tipo envío */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Tipo de envío
        </label>
        <select
          {...register('shipping_type')}
          className="form-select w-full rounded-lg border-gray-300 focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="free">Envío gratis</option>
          <option value="local_pickup">Recogida local</option>
          <option value="paid">Envío pagado</option>
        </select>
        {errors.shipping_type && <p className="form-error">{errors.shipping_type.message}</p>}
      </div>
    </section>
  );
}
