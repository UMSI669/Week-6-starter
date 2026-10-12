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

  return payload.results
    .map((observation) => {
      const photo = observation.photos?.[0];
      const coordinates = observation.geojson?.coordinates;

      return {
        id: observation.id,
        speciesName:
          observation.taxon?.preferred_common_name ||
          observation.taxon?.name ||
          'Maple observation',
        scientificName: observation.taxon?.name,
        observedOn: observation.observed_on,
        coordinates: coordinates
          ? { latitude: coordinates[1], longitude: coordinates[0] }
          : null,
        photoUrl: photo?.url?.replace('square', 'medium') || null,
        photoAttribution: photo?.attribution || null,
        photoLicense: photo?.license_code || null,
        observer: observation.user?.login || null,
        observationUrl:
          observation.uri || `https://www.inaturalist.org/observations/${observation.id}`,
      };
    })
    .sort((first, second) => {
      if (!first.observedOn) return 1;
      if (!second.observedOn) return -1;
      return second.observedOn.localeCompare(first.observedOn);
    });
}
