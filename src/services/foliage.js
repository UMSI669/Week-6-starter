import foliageData from '../../data/foliage-status.json';
import { getFoliageAppearance } from '../utils/foliageColors';

export function getFoliageStatusForDestination(destination) {
  const report = foliageData.destinations.find((item) => item.id === destination.id);
  const status = report?.status || 'unknown';

  return {
    ...getFoliageAppearance(status),
    region: destination.region,
    lastUpdated: report?.lastUpdated || null,
    reportLocation: report?.reportLocation || null,
    percentageRange: report?.percentageRange || null,
    estimatedPeak: report?.estimatedPeak || null,
    source: foliageData.source,
    sourceUrl: foliageData.sourceUrl,
    lastChecked: foliageData.lastChecked,
    isAvailable: Boolean(report),
    note: foliageData.note,
  };
}

export function getFoliageDataInfo() {
  return foliageData;
}
