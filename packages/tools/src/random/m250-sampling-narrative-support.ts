import type { ToolJsonSchema } from "../core/definition.js";
import { simpleError } from "../core/simple.js";
import { runUnique } from "../list/unique/tool.js";
import { runFrequency } from "../list/frequency/tool.js";
import { calculateRandomItem } from "./item/tool.js";
import { calculate as calculateWeightedItem } from "./weighted-item/tool.js";
import type { GeneratorRandom } from "./generator-random.js";

export const snId = { type: "string", minLength: 1, maxLength: 128 } as const;
export const snText = { type: "string", maxLength: 4096 } as const;
export const snInteger = { type: "integer", minimum: 0 } as const;
export const snProbability = {
  type: "number",
  minimum: 0,
  maximum: 1,
} as const;
export const snObject = (
  properties: Readonly<Record<string, ToolJsonSchema>>,
  required: readonly string[] = Object.keys(properties),
): ToolJsonSchema => ({
  type: "object",
  additionalProperties: false,
  properties,
  required,
});
export const snArray = (
  items: ToolJsonSchema,
  maximum: number,
  minimum = 0,
): ToolJsonSchema => ({
  type: "array",
  items,
  minItems: minimum,
  maxItems: maximum,
});
export type SamplingRecord = {
  readonly id: string;
  readonly values: readonly string[];
};
export const snRecord = snObject({ id: snId, values: snArray(snText, 32) });
export const snCopyRecord = (record: SamplingRecord): SamplingRecord => ({
  id: record.id,
  values: [...record.values],
});

export const snDistinct = (values: readonly string[], field: string): void => {
  const result = runUnique({ values });
  if (!result.ok)
    throw new Error("Validated string IDs failed the unique core.");
  if (result.output.values.length !== values.length)
    simpleError(
      field,
      "IDs or values must be distinct under exact string equality.",
      "duplicate_id",
    );
};
export const snFrequencies = (
  values: readonly string[],
): ReadonlyMap<string, number> => {
  const result = runFrequency({ values });
  if (!result.ok)
    throw new Error("Validated strings failed the frequency core.");
  return new Map(Object.entries(result.output.frequencies));
};
/** Always delegates with the same checked source, including singleton draws. */
export const snPick = <T>(values: readonly T[], random: GeneratorRandom): T => {
  if (!values.length)
    return simpleError(
      "count",
      "No eligible candidates remain.",
      "empty_candidates",
    );
  // Internal model candidates are nonnull; nullable caller data never enters this helper.
  const value = calculateRandomItem(values, random.unit);
  if (value === null) throw new Error("Validated item draw failed.");
  return value;
};
export const snSample = <T>(
  values: readonly T[],
  count: number,
  replacement: boolean,
  random: GeneratorRandom,
): T[] => {
  const pool = [...values],
    result: T[] = [];
  if (count > 0 && (!pool.length || (!replacement && count > pool.length)))
    simpleError(
      "count",
      "The requested sample exceeds the available population.",
      "infeasible_sample",
    );
  for (let i = 0; i < count; i += 1) {
    const selected = snPick(pool, random);
    result.push(selected);
    if (!replacement) pool.splice(pool.indexOf(selected), 1);
  }
  return result;
};
export const snWeightedIndex = (
  weights: readonly number[],
  random: GeneratorRandom,
): number => {
  const total = weights.reduce((sum, value) => sum + value, 0);
  if (!Number.isFinite(total) || total <= 0)
    return simpleError(
      "weights",
      "Remaining weights require a finite positive sum.",
      "invalid_weight_total",
    );
  // The existing weighted-item validator supports128 labels. For a larger pool,
  // select a block by its remaining mass, then a position within that block.
  // Both delegated draws use the same advancing source; masses are never rounded.
  if (weights.length > 128) {
    const blocks = Array.from(
      { length: Math.ceil(weights.length / 128) },
      (_, i) => weights.slice(i * 128, (i + 1) * 128),
    );
    const block = snWeightedIndex(
      blocks.map((values) => values.reduce((sum, value) => sum + value, 0)),
      random,
    );
    return block * 128 + snWeightedIndex(blocks[block], random);
  }
  const output = calculateWeightedItem(
    {
      seed: "m250-sampling-narrative",
      actualCandidateValues: weights.map((_, i) => String(i)),
      callerActualNonnegativeWeights: weights,
    },
    { random: random.unit },
  );
  const value = output.result.selectedValue;
  if (typeof value !== "string" || !/^(0|[1-9][0-9]*)$/.test(value))
    throw new Error("Weighted core returned an invalid index.");
  const index = Number(value);
  if (index >= weights.length || weights[index] <= 0)
    throw new Error("Weighted core selected an ineligible position.");
  return index;
};
export const snBoundOutput = <T>(value: T): T => {
  if (JSON.stringify(value).length > 1_000_000)
    simpleError(
      "output",
      "Serialized output exceeds 1,000,000 UTF-16 units.",
      "resource_limit_exceeded",
    );
  return value;
};
/** Bound materialized repeated record data before allocating the occurrences. */
export const snExpansionBudget = (
  records: readonly SamplingRecord[],
  occurrences: number,
  field: string,
): void => {
  const maximumRecordUnits = records.reduce(
    (maximum, record) => Math.max(maximum, JSON.stringify(record).length + 256),
    0,
  );
  if (maximumRecordUnits * occurrences > 750000)
    simpleError(
      field,
      "Worst-case repeated record content exceeds the 750000-unit expansion budget.",
      "resource_limit_exceeded",
    );
};
/** Template substitution never interprets replacement values as templates. */
export const snTemplate = (
  template: string,
  values: Readonly<Record<string, string>>,
  field: string,
): string => {
  const remainder = template.replace(
    /\{([A-Za-z][A-Za-z0-9]*)\}/g,
    (_, token: string) => {
      if (!Object.hasOwn(values, token))
        return simpleError(
          field,
          `Unsupported template token: ${token}.`,
          "invalid_template",
        );
      return "";
    },
  );
  if (/[{}]/u.test(remainder))
    simpleError(
      field,
      "Template braces must delimit supported tokens.",
      "invalid_template",
    );
  return template.replace(
    /\{([A-Za-z][A-Za-z0-9]*)\}/g,
    (_, token: string) => values[token],
  );
};
