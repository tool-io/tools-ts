import { simpleError } from "../core/simple.js";
import { bounded, shape } from "../game/shared.js";
import { dateDay } from "../accounting/calendar.js";
export * from "../accounting/batch-shared.js";
export const wordTokens = (text: string): string[] => {
  if (text.length > 65536)
    return simpleError("text", "At most 65536 UTF-16 code units required.");
  return (
    text
      .toLocaleLowerCase("en-US")
      .match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? []
  );
};
export const countWords = (text: string): number => wordTokens(text).length;
export const codepoints = (text: string): string[] => {
  if (text.length > 65536)
    return simpleError("text", "At most 65536 code units required.");
  return Array.from(text);
};
export const ngrams = (tokens: readonly string[], n: number): Set<string> => {
  bounded(n, "ngramSize", 1, 10);
  return new Set(
    Array.from({ length: Math.max(0, tokens.length - n + 1) }, (_, i) =>
      JSON.stringify(tokens.slice(i, i + n)),
    ),
  );
};
export const instant = (text: string): number => {
  const m =
    /^((?:19|20|21)[0-9]{2}-[0-9]{2}-[0-9]{2})T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])Z$(?![\s\S])/.exec(
      text,
    );
  if (!m)
    return simpleError(
      "timestamp",
      "Exact real 1900–2199 UTC ISO timestamp with whole seconds and Z required; local/ambiguous wall time is not inferred.",
    );
  dateDay(m[1]);
  return Date.parse(text);
};
export const instants = (values: readonly string[]): number[] =>
  values.map(instant);
export const sequence = (values: readonly number[], field: string): void => {
  if (
    values.some(
      (v, i) => !Number.isFinite(v) || v < 0 || (i > 0 && v < values[i - 1]),
    )
  )
    simpleError(
      field,
      "Nonnegative nondecreasing explicit times/positions required.",
    );
};
export const spanRows = (
  rows: readonly (readonly number[])[],
  duration: number,
): void => {
  if (rows.length === 0) return;
  if (shape(rows, "intervals") !== 2)
    simpleError("intervals", "Explicit start/end interval pairs required.");
  rows.forEach(([a, b]) => {
    if (a < 0 || b < a || b > duration)
      simpleError("intervals", "Ordered bounded start/end intervals required.");
  });
};
export const coverage = (
  spans: readonly (readonly number[])[],
  duration: number,
): number => {
  spanRows(spans, duration);
  const rows = spans.map((r) => [...r]).sort((a, b) => a[0] - b[0]);
  let covered = 0,
    start = 0,
    end = 0;
  for (const [a, b] of rows) {
    if (a > end) {
      covered += end - start;
      start = a;
      end = b;
    } else end = Math.max(end, b);
  }
  return covered + end - start;
};
export const independentGroups = (
  sourceGroupIds: readonly string[],
  corroborationFlags: readonly number[],
): string[] => [
  ...new Set(sourceGroupIds.filter((_, i) => corroborationFlags[i] === 1)),
];
export const slope = (x: readonly number[], y: readonly number[]): number => {
  if (x.length < 2 || x.length !== y.length)
    return simpleError(
      "series",
      "At least two aligned finite observations required.",
    );
  const x0 = x[0],
    y0 = y[0],
    dx = x.map((v) => v - x0),
    dy = y.map((v) => v - y0),
    mx = dx.reduce((a, b) => a + b, 0) / x.length,
    my = dy.reduce((a, b) => a + b, 0) / x.length,
    variance = dx.reduce((s, v) => s + (v - mx) ** 2, 0);
  if (!variance)
    return simpleError(
      "x",
      "Distinct x coordinates required for trend comparison.",
    );
  return dx.reduce((s, v, i) => s + (v - mx) * (dy[i] - my), 0) / variance;
};
