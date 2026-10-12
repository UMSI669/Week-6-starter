import { useQuery } from '@tanstack/react-query';

import { fetchTreeObservations } from '../services/inaturalist';

export function useTreeObservations(destination, radius = 25) {
  return useQuery({
    // AI-generated comment:
    // Every input that can change the response belongs in the query key so the cache stays accurate.
    queryKey: [
      'tree-observations',
      destination?.id,
      destination?.latitude,
      destination?.longitude,
      radius,
    ],
    queryFn: () =>
      fetchTreeObservations({
        latitude: destination.latitude,
        longitude: destination.longitude,
        radius,
      }),
    enabled: Boolean(destination),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
}
