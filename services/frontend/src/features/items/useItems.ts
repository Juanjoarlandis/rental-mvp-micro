import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import type { Item } from './types';

/**
 * Hook que devuelve la lista pública de ítems.
 * Acepta los mismos parámetros de querystring que la API (name, min_price…).
 */
export function useItems(params?: URLSearchParams) {
  const queryKey = ['items', params?.toString() ?? ''];

  const { data, isLoading, refetch } = useQuery<Item[]>({
    queryKey,
    queryFn: () =>
      api.get<Item[]>('/items/', { params }).then(r => r.data),
    staleTime: 60_000 // 1 min
  });

  return { data: data ?? [], loading: isLoading, refetch };
}

/* Reexportamos el tipo para mantener compatibilidad con imports existentes */
export type { Item };
