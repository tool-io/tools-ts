import { runFrequency } from "../list/frequency/tool.js";
import { runSortNumbers } from "../list/sort-numbers/tool.js";
import { coreOutput } from "./m500b-csv-algorithms-schemas.js";

/** Preserve first occurrence order while adapting the old string-count core. */
export const sequenceCounts = (
  values: readonly string[],
): { readonly key: string; readonly count: number }[] => {
  const frequencies = coreOutput(runFrequency({ values })).frequencies;
  return [...new Set(values)].map((key) => {
    const count: unknown = frequencies[key];
    if (
      !Object.hasOwn(frequencies, key) ||
      typeof count !== "number" ||
      !Number.isSafeInteger(count) ||
      count < 1
    )
      throw new Error(
        "The frequency core did not return a constructed token count.",
      );
    return { key, count };
  });
};
export const sortedNumbers = (values: readonly number[]): number[] =>
  coreOutput(runSortNumbers({ values, descending: false })).values;
