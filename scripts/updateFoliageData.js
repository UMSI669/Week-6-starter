const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_BULLETIN_URL =
  'https://content.govdelivery.com/accounts/MIEDC/bulletins/42cda96';
const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'data', 'foliage-status.json');

// MEDC reports named communities rather than park boundaries. Each destination
// uses the closest suitable community in the bulletin as a transparent proxy.
const destinationReports = [
  { id: 'sleeping-bear', region: 'Northwest Michigan', reportLocation: 'Crystal Mountain' },
  { id: 'tahquamenon-falls', region: 'Eastern Upper Peninsula', reportLocation: 'Sault Ste. Marie' },
  { id: 'pictured-rocks', region: 'Central Upper Peninsula', reportLocation: 'Munising' },
  { id: 'porcupine-mountains', region: 'Western Upper Peninsula', reportLocation: 'Bond Falls Area' },
  { id: 'huron-manistee', region: 'Northern Lower Peninsula', reportLocation: 'Alpena' },
  { id: 'hartwick-pines', region: 'North-Central Michigan', reportLocation: 'Grayling' },
  { id: 'ludington', region: 'West Michigan', reportLocation: 'Manistee' },
  { id: 'kensington', region: 'Southeast Michigan', reportLocation: 'Ann Arbor' },
  { id: 'waterloo', region: 'Southern Michigan', reportLocation: 'Ann Arbor' },
  { id: 'holland', region: 'West Michigan', reportLocation: 'Saugatuck' },
];

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;|\u00a0/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—');
}

function textContent(value) {
  return decodeHtml(value.replace(/<br\s*\/?\s*>/gi, ' ').replace(/<[^>]+>/g, ''))
    .replace(/Â/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeLocation(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function statusForRange(lower, upper) {
  if (lower === 0 && upper <= 20) return 'early';
  if (upper <= 40) return 'changing';
  if (upper <= 80) return 'near-peak';
  if (upper <= 100) return 'peak';
  throw new Error(`Unsupported fall-color percentage range: ${lower}-${upper}%`);
}

function parsePublicationDate(html) {
  const dateline = textContent(
    html.match(/<span class=['"]dateline[^>]*>([\s\S]*?)<\/span>/i)?.[1] || ''
  );
  const match = dateline.match(/sent this bulletin at (\d{2})\/(\d{2})\/(\d{4})/i);

  if (!match) throw new Error('Could not find the MEDC bulletin publication date.');
  return `${match[3]}-${match[1]}-${match[2]}`;
}

function parseBulletin(html) {
  const title = textContent(
    html.match(/<h1 class=['"]bulletin_subject['"]>([\s\S]*?)<\/h1>/i)?.[1] || ''
  );
  if (!/^Fall Color Report:/i.test(title)) {
    throw new Error('The supplied page is not an MEDC Fall Color Report bulletin.');
  }

  const reports = new Map();
  const entryPattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>\s*<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = entryPattern.exec(html)) !== null) {
    const reportLocation = textContent(match[1]);
    const fallColor = textContent(match[2]);
    const range = fallColor.match(/Fall Color:\s*(\d{1,3})\s*[-–—]\s*(\d{1,3})\s*%/i);
    if (!range) continue;

    const lower = Number(range[1]);
    const upper = Number(range[2]);
    const peakHtml = match[3].match(
      /Estimated Peak Fall Color:\s*([\s\S]*?)(?:<br\b|<\/strong>)/i
    )?.[1];

    reports.set(normalizeLocation(reportLocation), {
      reportLocation,
      percentageRange: `${lower}-${upper}%`,
      estimatedPeak: peakHtml ? textContent(peakHtml) : null,
      status: statusForRange(lower, upper),
    });
  }

  if (reports.size === 0) {
    throw new Error('No named MEDC fall-color reports were found in the bulletin.');
  }

  return { title, published: parsePublicationDate(html), reports };
}

function validateBulletinUrl(value) {
  const url = new URL(value);
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'content.govdelivery.com' ||
    !/^\/accounts\/MIEDC\/bulletins\/[a-z0-9]+$/i.test(url.pathname)
  ) {
    throw new Error('Use a public MEDC GovDelivery bulletin URL.');
  }
  return url.toString();
}

async function main() {
  const sourceUrl = validateBulletinUrl(process.argv[2] || DEFAULT_BULLETIN_URL);
  const response = await fetch(sourceUrl, {
    headers: { Accept: 'text/html', 'User-Agent': 'Michigan-Fall-Finder/1.0' },
  });
  if (!response.ok) {
    throw new Error(`MEDC bulletin request failed with HTTP ${response.status}.`);
  }

  const bulletin = parseBulletin(await response.text());
  const destinations = destinationReports.flatMap((destination) => {
    const report = bulletin.reports.get(normalizeLocation(destination.reportLocation));
    if (!report) {
      console.warn(
        `No MEDC entry found for ${destination.reportLocation}; ${destination.id} will remain Unknown.`
      );
      return [];
    }
    return [{ ...destination, ...report, lastUpdated: bulletin.published }];
  });

  const data = {
    schemaVersion: 2,
    lastChecked: new Date().toISOString().slice(0, 10),
    reportPublished: bulletin.published,
    reportTitle: bulletin.title,
    source: 'MEDC / Pure Michigan Fall Color Report',
    sourceUrl,
    delivery: 'bundled-medc-bulletin-import',
    note: 'MEDC reports named communities. Marker estimates use the named report location shown in each destination detail and are not park-level observations.',
    destinations,
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Imported ${destinations.length} destination estimates from ${bulletin.title}.`);
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
