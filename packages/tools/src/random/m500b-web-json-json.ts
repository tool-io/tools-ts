import { calculateJsonPrettyPrint } from "../json/pretty-print/tool.js";
import { calculateRandomItem } from "./item/tool.js";
import type { GeneratorRandom } from "./generator-random.js";
import { simpleError } from "../core/simple.js";
import type { Entry, Scalar } from "./m500b-web-json-schema.js";

/** Always adapt legacy selection to the same checked advancing source. */
export const pick = <T>(values: readonly T[], random: GeneratorRandom): T => {
  const selected = calculateRandomItem(values, random.unit);
  if (selected === null)
    return simpleError(
      "values",
      "A non-null fixture candidate is required.",
      "empty_candidates",
    );
  return selected;
};
export const distinct = (values: readonly string[], field: string): void => {
  if (new Set(values).size !== values.length)
    simpleError(field, "Entries must be distinct.", "duplicate_entries");
};
export const entriesObject = (
  entries: readonly Entry[],
  field = "entries",
): Readonly<Record<string, Scalar>> => {
  distinct(
    entries.map((entry) => entry.key),
    field,
  );
  return Object.fromEntries(
    entries.map((entry) => [entry.key, entry.value === 0 ? 0 : entry.value]),
  );
};
export const pretty = (value: unknown): string => {
  const result = calculateJsonPrettyPrint({ json: JSON.stringify(value) });
  if (!result.ok)
    throw new Error("Constructed finite JSON failed pretty printing.");
  return result.output.pretty;
};
export const budget = (
  count: number,
  width: number,
  field: string,
  maximum = 2048,
): void => {
  if (count * width > maximum)
    simpleError(
      field,
      "Fixture expansion exceeds the declared work budget.",
      "resource_limit",
    );
};
