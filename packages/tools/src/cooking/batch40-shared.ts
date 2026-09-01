import { simpleError } from "../core/simple.js";
import {
  aligned,
  positive,
  nonnegative,
  binary,
  ordered,
  sum,
  mean,
  shape,
  fraction,
  finite,
  integer,
  bounded,
} from "../geology/batch39-shared.js";
export * from "../taxation/batch39-shared.js";
export const acyclicEdges = (
  nodeCount: number,
  edges: readonly (readonly number[])[],
): void => {
  bounded(nodeCount, "nodes", 1, 128);
  if (edges.length && shape(edges, "dependencies") !== 2)
    simpleError("edges", "Explicit prerequisite/dependent index pairs.");
  const graph = Array.from({ length: nodeCount }, () => [] as number[]),
    state = Array<number>(nodeCount).fill(0);
  edges.forEach(([a, b]) => {
    bounded(a, "prerequisite", 0, nodeCount - 1);
    bounded(b, "dependent", 0, nodeCount - 1);
    graph[a].push(b);
  });
  const visit = (n: number): void => {
    if (state[n] === 1)
      simpleError("cycle", "Caller prerequisite graph must be acyclic.");
    if (state[n] === 2) return;
    state[n] = 1;
    graph[n].forEach(visit);
    state[n] = 2;
  };
  state.forEach((_, i) => visit(i));
};
export const pick = <T>(
  key: string,
  table: Readonly<Record<string, T>>,
  field: string,
): T => {
  if (!Object.hasOwn(table, key))
    simpleError(
      field,
      "Explicit supported token required; no inferred context.",
    );
  return table[key];
};
export const observedBands = (
  observed: readonly number[],
  lower: readonly number[],
  upper: readonly number[],
  known: readonly number[],
): {
  signedKnownMargins: number[];
  knownReviewIndices: number[];
  unknownIndices: number[];
} => {
  for (const v of [lower, upper, known]) aligned(observed, v, "criteria");
  binary(known, "known");
  lower.forEach((v, i) => ordered(v, upper[i]));
  return {
    signedKnownMargins: observed.map((v, i) =>
      known[i] ? finite(Math.min(v - lower[i], upper[i] - v)) : 0,
    ),
    knownReviewIndices: observed.flatMap((v, i) =>
      known[i] && (v < lower[i] || v > upper[i]) ? [i] : [],
    ),
    unknownIndices: known.flatMap((v, i) => (!v ? [i] : [])),
  };
};
export const occupancy = (
  minutes: readonly number[],
  flags: readonly number[],
): number => {
  aligned(minutes, flags, "observations");
  minutes.forEach((v) => nonnegative(v, "minutes"));
  binary(flags, "flags");
  return sum(minutes.map((v, i) => v * flags[i]));
};
export const elapsedStats = (
  starts: readonly number[],
  ends: readonly number[],
): { observedElapsedTimes: number[]; observedMeanElapsedTime: number } => {
  aligned(starts, ends, "event pairs");
  starts.forEach((v, i) => ordered(v, ends[i]));
  const d = starts.map((v, i) => finite(ends[i] - v));
  return { observedElapsedTimes: d, observedMeanElapsedTime: mean(d) };
};
export const exactProduct = (a: number, b: number): number => {
  integer(a, "count");
  integer(b, "count");
  return integer(Number(BigInt(a) * BigInt(b)), "exact product");
};
export const portions = (
  total: number,
  unit: number,
): { completePortions: number; unallocatedAmount: number } => {
  nonnegative(total, "total");
  positive(unit, "unit portion");
  const n = integer(Math.floor(total / unit), "portions");
  return { completePortions: n, unallocatedAmount: finite(total - n * unit) };
};
export const weightedComposition = (
  masses: readonly number[],
  fractions: readonly number[],
): number => {
  aligned(masses, fractions, "ingredients");
  masses.forEach((v) => nonnegative(v, "ingredient mass"));
  fractions.forEach((v) => fraction(v, "assayed mass fraction"));
  const total = positive(sum(masses), "total ingredient mass");
  return sum(masses.map((v, i) => (v / total) * fractions[i]));
};
