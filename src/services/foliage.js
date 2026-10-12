import foliageData from '../../data/foliage-status.json';
import { getFoliageAppearance } from '../utils/foliageColors';

export function getFoliageStatusForRegion(region) {
  const report = foliageData.regions.find((item) => item.region === region);
  const status = report?.status || 'unknown';

  return {
    ...getFoliageAppearance(status),
    region,
    lastUpdated: report?.lastUpdated || null,
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
