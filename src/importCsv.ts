import { Card } from './scheduler';
import { createCard, seedCards } from './cards';

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

/**
 * Parse a CSV string into Card objects and load them into the card store.
 *
 * Expected CSV format (header row required):
 *   front,back
 *   "What is 2+2?","4"
 *   "Capital of France?","Paris"
 *
 * Optional columns (ignored if absent): id, interval, ease, due
 */
export function importFromCsv(csvText: string): ImportResult {
  const result: ImportResult = { imported: 0, skipped: 0, errors: [] };

  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    result.errors.push('CSV must have a header row and at least one data row.');
    return result;
  }

  const headers = parseCsvRow(lines[0]).map((h) => h.toLowerCase().trim());
  const frontIdx = headers.indexOf('front');
  const backIdx = headers.indexOf('back');

  if (frontIdx === -1 || backIdx === -1) {
    result.errors.push('CSV must contain "front" and "back" columns.');
    return result;
  }

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvRow(lines[i]);
    const front = cols[frontIdx]?.trim();
    const back = cols[backIdx]?.trim();

    if (!front || !back) {
      result.skipped++;
      result.errors.push(`Row ${i + 1}: missing front or back value, skipped.`);
      continue;
    }

    createCard(front, back);
    result.imported++;
  }

  return result;
}

/** Minimal CSV row parser that handles double-quoted fields with embedded commas. */
function parseCsvRow(row: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}
