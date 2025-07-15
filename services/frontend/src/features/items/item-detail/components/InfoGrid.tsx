import type { ItemDetail } from '../../types';

export default function InfoGrid({ item }: { item: ItemDetail }) {
  const rows = [
    ['SKU', item.sku ?? '—'],
    ['Peso (kg)', item.weight_kg?.toFixed(2) ?? '—'],
    [
      'Tipo de envío',
      { free: 'Envío gratis', local_pickup: 'Recogida local', paid: 'Envío pagado' }[
        item.shipping_type
      ]
    ],
    ['Condición', item.condition === 'new' ? 'Nuevo' : 'Usado']
  ];

  return (
    <table className="w-full text-sm text-gray-600 dark:text-gray-300">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k as string} className="border-t border-gray-200 dark:border-gray-700">
            <th className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-400">{k}</th>
            <td className="py-2">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
