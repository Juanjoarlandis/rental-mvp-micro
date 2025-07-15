import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../api';
import type { ItemDetail } from '../../types';

/**
 * Obtiene los datos completos de un ítem por ID.
 * Se usa dentro del modal de detalle.
 */
export default function useItem(itemId: number | null) {
  return useQuery<ItemDetail>({
    queryKey: ['item', itemId],
    enabled: !!itemId,
    queryFn: () => api.get<ItemDetail>(`/items/${itemId}`).then(r => r.data),
    staleTime: 60_000
  });
}
