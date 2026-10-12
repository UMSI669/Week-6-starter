const API_URL = 'https://api.inaturalist.org/v1/observations';
const MAPLE_TAXON_ID = 47727;

export async function fetchTreeObservations({ latitude, longitude, radius = 25 }) {
  const query = new URLSearchParams({
    taxon_id: String(MAPLE_TAXON_ID),
    lat: String(latitude),
    lng: String(longitude),
    radius: String(radius),
    quality_grade: 'research',
    photos: 'true',
    order_by: 'observed_on',
    order: 'desc',
    per_page: '12',
  });

  const response = await fetch(`${API_URL}?${query}`);

  if (!response.ok) {
    throw new Error('The iNaturalist request was not successful.');
  }

  const payload = await response.json();

  return payload.results.map((observation) => ({
    id: observation.id,
    speciesName:
      observation.taxon?.preferred_common_name ||
      observation.taxon?.name ||
      'Maple observation',
    scientificName: observation.taxon?.name,
    observedOn: observation.observed_on,
    photoUrl: observation.photos?.[0]?.url?.replace('square', 'medium') || null,
    observationUrl: observation.uri || `https://www.inaturalist.org/observations/${observation.id}`,
  }));
}
