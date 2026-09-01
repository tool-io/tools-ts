import { simpleError } from "../core/simple.js";
import { bounded, aligned } from "../game/shared.js";
import { integer, weightedMinor } from "../accounting/batch-shared.js";
export * from "../plumbing/batch35-shared.js";
export const money = (v: number, f = "money"): number =>
  bounded(v, f, 0, 1000000000000);
export const share = (value: number, basisPoints: number): number => {
  money(value);
  bounded(basisPoints, "basisPoints", 0, 10000);
  return weightedMinor(value, basisPoints, 10000);
};
export const rating = (
  x: number,
  lowerEdges: readonly number[],
  values: readonly number[],
): number => {
  aligned(lowerEdges, values, "rating");
  if (
    lowerEdges[0] !== 0 ||
    lowerEdges.some(
      (v, i) =>
        !Number.isFinite(v) || v < 0 || (i > 0 && v <= lowerEdges[i - 1]),
    ) ||
    !Number.isFinite(x) ||
    x < 0
  )
    return simpleError(
      "rating",
      "Ordered lower-inclusive caller edges beginning at zero required.",
    );
  return values[lowerEdges.reduce((best, v, i) => (x >= v ? i : best), -1)];
};
