import { sampleRandomSource, type RandomSource } from "./number/tool.js";

export type CodePointRange = readonly [start: number, end: number];
export type RandomValueSource =
  | { readonly ranges: readonly CodePointRange[] }
  | { readonly values: readonly string[] };

const rangeSize = ([start, end]: CodePointRange): number => end - start + 1;

export const selectRandomValue = (
  source: RandomValueSource,
  random: RandomSource = Math.random,
): string | null => {
  const sample = sampleRandomSource(random);
  if (sample === null) return null;

  if ("values" in source) {
    if (source.values.length === 0) return null;
    return source.values[Math.floor(sample * source.values.length)] ?? null;
  }

  const size = source.ranges.reduce(
    (total, range) => total + rangeSize(range),
    0,
  );
  if (!Number.isSafeInteger(size) || size < 1) return null;

  let offset = Math.floor(sample * size);
  for (const range of source.ranges) {
    const length = rangeSize(range);
    if (offset < length) return String.fromCodePoint(range[0] + offset);
    offset -= length;
  }
  return null;
};
