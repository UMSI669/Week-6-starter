const fs = require('node:fs');
const path = require('node:path');

const allowedStatuses = new Set([
  'early',
  'changing',
  'near-peak',
  'peak',
  'past-peak',
  'unknown',
]);
const projectRoot = path.resolve(__dirname, '..');
const inputPath = path.join(projectRoot, 'data', 'foliage-status.manual.json');
const outputPath = path.join(projectRoot, 'data', 'foliage-status.json');

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validate(data) {
  if (data.sourceUrl !== 'https://www.michigan.org/fall-color-reports') {
    throw new Error('The sourceUrl must identify the official Michigan fall color report.');
  }
  if (!isIsoDate(data.lastChecked)) {
    throw new Error('lastChecked must use YYYY-MM-DD.');
  }
  if (!Array.isArray(data.regions)) {
    throw new Error('regions must be an array.');
  }

  for (const report of data.regions) {
    if (!report.region || !allowedStatuses.has(report.status)) {
      throw new Error(`Invalid region or status: ${JSON.stringify(report)}`);
    }
    if (report.lastUpdated && !isIsoDate(report.lastUpdated)) {
      throw new Error(`Invalid lastUpdated date for ${report.region}.`);
    }
  }
}

if (!fs.existsSync(inputPath)) {
  throw new Error(
    'Create data/foliage-status.manual.json from the example after verifying reuse permission and report values.'
  );
}

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
validate(data);
fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Validated foliage data written to ${outputPath}`);
