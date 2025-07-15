import { useFormContext } from 'react-hook-form';

export default function InventorySection() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <section className="space-y-6">
      {/* SKU */}
      <div className="relative">
        <input
          {...register('sku')}
          id="sku"
          placeholder="SKU (opcional)"
          className="peer form-input w-full rounded-lg border-gray-300 placeholder-transparent focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700 dark:focus:border-brand"
        />
        <label
          htmlFor="sku"
          className="form-floating-label peer-placeholder-shown:form-floating-label--placeholder dark:bg-gray-800"
        >
          SKU
        </label>
        {errors.sku && <p className="form-error">{errors.sku.message}</p>}
      </div>

      {/* Stock */}
      <div className="relative">
        <input
          {...register('stock', { valueAsNumber: true })}
          id="stock"
          placeholder="Stock disponible"
          type="number"
          min={0}
          className="peer form-input w-full rounded-lg border-gray-300 placeholder-transparent focus:border-brand focus:ring-brand dark:border-gray-600 dark:bg-gray-700 dark:focus:border-brand"
        />
        <label
          htmlFor="stock"
          className="form-floating-label peer-placeholder-shown:form-floating-label--placeholder dark:bg-gray-800"
        >
          Stock
        </label>
        {errors.stock && <p className="form-error">{errors.stock.message}</p>}
      </div>
    </section>
  );
}
