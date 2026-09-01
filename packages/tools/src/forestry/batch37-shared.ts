import { simpleError } from "../core/simple.js";
import { aligned, positive, nonnegative, binary } from "../game/shared.js";
import { sum } from "../horticulture/batch34-shared.js";
import { finite } from "../plumbing/batch35-shared.js";
import { strictlyIncreasing } from "../glaciology/batch32-shared.js";
export * from "../semiconductor/batch36-shared.js";
export const inventory = (
  amounts: readonly number[],
  known: readonly number[],
): { knownTotal: number; unassessedCount: number } => {
  aligned(amounts, known, "inventory");
  binary(known, "known");
  amounts.forEach((v) => nonnegative(v, "amount"));
  return {
    knownTotal: sum(amounts.filter((_, i) => known[i] === 1)),
    unassessedCount: known.filter((v) => v === 0).length,
  };
};
export const classified = (
  amounts: readonly number[],
  labels: readonly string[],
  target: string,
): {
  matchedTotal: number;
  matchedCount: number;
  unclassifiedCount: number;
} => {
  aligned(amounts, labels, "classified inventory");
  amounts.forEach((v) => nonnegative(v, "amount"));
  if (!target.trim() || labels.some((s) => !s.trim()))
    simpleError(
      "class",
      "Explicit already independently assigned class labels or literal unknown required.",
    );
  return {
    matchedTotal: sum(amounts.filter((_, i) => labels[i] === target)),
    matchedCount: labels.filter((s) => s === target).length,
    unclassifiedCount: labels.filter((s) => s === "unknown").length,
  };
};
export const demand = (
  loads: readonly number[],
  capacities: readonly number[],
  known: readonly number[],
): {
  signedMargins: number[];
  knownDeficitIndices: number[];
  unknownCapacityIndices: number[];
} => {
  aligned(loads, capacities, "demand");
  aligned(loads, known, "known");
  binary(known, "known");
  loads.forEach((v) => nonnegative(v, "load"));
  capacities.forEach((v) => nonnegative(v, "capacity"));
  return {
    signedMargins: loads.map((v, i) => (known[i] ? capacities[i] - v : 0)),
    knownDeficitIndices: loads.flatMap((v, i) =>
      known[i] && v > capacities[i] ? [i] : [],
    ),
    unknownCapacityIndices: known.flatMap((v, i) => (!v ? [i] : [])),
  };
};
export const secants = (
  x: readonly number[],
  y: readonly number[],
): number[] => {
  aligned(x, y, "trace");
  strictlyIncreasing(x, "coordinates");
  return x
    .slice(1)
    .map((v, i) => finite(finite(y[i + 1] - y[i]) / finite(v - x[i])));
};
export const lnResidual = (
  observed: readonly number[],
  ultimate: number,
): number[] => {
  positive(ultimate, "ultimate");
  observed.forEach((v) => {
    if (v < 0 || v >= ultimate)
      simpleError(
        "recovery",
        "Observed response [0, ultimate) required for log residual fit.",
      );
  });
  return observed.map((v) => Math.log1p(-v / ultimate));
};
