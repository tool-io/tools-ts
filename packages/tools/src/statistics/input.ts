import { parseNumericDataset } from "../parse/numeric-dataset/tool.js";

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const finiteDataset = (
  value: unknown,
): readonly number[] | undefined => {
  if (Array.isArray(value)) {
    return value.length > 0 &&
      value.every(
        (entry): entry is number =>
          typeof entry === "number" && Number.isFinite(entry),
      )
      ? value
      : undefined;
  }
  const result = parseNumericDataset({ value });
  return result.ok ? result.output.values : undefined;
};

export const finiteGroups = (
  value: unknown,
): readonly (readonly number[])[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const groups = value.map(finiteDataset);
  return groups.every(
    (group): group is readonly number[] => group !== undefined,
  )
    ? groups
    : undefined;
};

export const mean = (values: readonly number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

export const sampleVariance = (values: readonly number[]): number => {
  const center = mean(values);
  return (
    values.reduce((sum, value) => sum + (value - center) ** 2, 0) /
    (values.length - 1)
  );
};

export const averageRanks = (values: readonly number[]): number[] => {
  const ordered = values
    .map((value, index) => ({ index, value }))
    .sort(
      (left, right) => left.value - right.value || left.index - right.index,
    );
  const ranks = new Array<number>(values.length);
  let start = 0;
  while (start < ordered.length) {
    let end = start + 1;
    while (
      end < ordered.length &&
      ordered[end]?.value === ordered[start]?.value
    )
      end += 1;
    const rank = (start + 1 + end) / 2;
    for (let index = start; index < end; index += 1)
      ranks[ordered[index]!.index] = rank;
    start = end;
  }
  return ranks;
};

export const tieTerm = (values: readonly number[]): number => {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.values()].reduce(
    (sum, count) => sum + count ** 3 - count,
    0,
  );
};

export const pValues = (value: unknown): readonly number[] | undefined => {
  const values = finiteDataset(value);
  return values?.every((entry) => entry >= 0 && entry <= 1)
    ? values
    : undefined;
};

export const roundStatistic = (value: number): number =>
  Number(value.toPrecision(12));
