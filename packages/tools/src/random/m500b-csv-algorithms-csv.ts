import { simpleError } from "../core/simple.js";
import { calculateRandomItem } from "./item/tool.js";
import type { GeneratorRandom } from "./generator-random.js";
import {
  readCsvText,
  writeCsvRecords,
} from "../csv/rfc4180-quoted-field-parser-check/tool.js";
import { arraySchema, textSchema } from "./m500b-csv-algorithms-schemas.js";

export type CsvRows = readonly (readonly string[])[];
export const rowsSchema = arraySchema(arraySchema(textSchema, 8, 1), 32, 1);
export const outputRowsSchema = arraySchema(
  arraySchema({ type: "string", maxLength: 256 }, 10, 1),
  128,
);
export const delimiterSchema = {
  type: "string",
  enum: [",", ";", "\t"],
} as const;
export const csvTextSchema = { type: "string", maxLength: 100000 } as const;
export const csvItem = <T>(
  values: readonly T[],
  random: GeneratorRandom,
): T => {
  const selected = calculateRandomItem(values, random.unit);
  if (selected === null)
    throw new Error("Validated CSV candidates were empty or invalid.");
  return selected;
};
export const rectangular = (
  rows: CsvRows,
  width = rows[0]?.length ?? 0,
): number => {
  if (width < 1 || rows.some((row) => row.length !== width))
    return simpleError(
      "rows",
      "Supply rectangular records matching the declared header width.",
      "ragged_rows",
    );
  if (rows.length * width > 256)
    return simpleError(
      "rows",
      "The supplied table may contain at most 256 cells.",
      "resource_limit",
    );
  return width;
};
/** Preflight encoded length before the legacy writer allocates its output. */
export const csvText = (
  rows: CsvRows,
  delimiter = ",",
  quoteAll = false,
): string => {
  let size = Math.max(0, rows.length - 1),
    fields = 0;
  for (const row of rows) {
    fields += row.length;
    size += Math.max(0, row.length - 1);
    for (const cell of row) {
      const quotes = [...cell].filter((c) => c === '"').length;
      const quoted =
        quoteAll ||
        cell.includes(delimiter) ||
        /["\r\n]/u.test(cell) ||
        (row.length === 1 && cell === "");
      size += cell.length + (quoted ? quotes + 2 : 0);
    }
  }
  if (fields > 1024 || size > 100000)
    return simpleError(
      "rows",
      "Encoded CSV exceeds the fixture resource budget.",
      "resource_limit",
    );
  return writeCsvRecords(rows, delimiter, quoteAll);
};
export const decodedRows = (csv: string, delimiter = ","): CsvRows => {
  const parsed = readCsvText(csv, delimiter);
  if (!parsed.ok)
    throw new Error("Constructed CSV failed parsing: " + parsed.message);
  return parsed.records;
};
