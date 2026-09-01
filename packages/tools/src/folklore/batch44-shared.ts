import {
  simpleError,
  aligned,
  positive,
  sum,
  bounded,
} from "../heraldry/batch43-shared.js";
export * from "../heraldry/batch43-shared.js";
export const minimalObservedPeriod = (
  tokens: readonly string[],
): {
  minimalObservedPeriod: number;
  completeObservedCycles: number;
  trailingObservedTokens: number;
} => {
  if (!tokens.length || tokens.some((v) => !v.trim()))
    simpleError(
      "observations",
      "Nonempty independently observed ordered gesture IDs.",
    );
  let period = tokens.length;
  for (let k = 1; k < tokens.length; k++)
    if (tokens.every((v, i) => i < k || v === tokens[i % k])) {
      period = k;
      break;
    }
  return {
    minimalObservedPeriod: period,
    completeObservedCycles: Math.floor(tokens.length / period),
    trailingObservedTokens: tokens.length % period,
  };
};
export const annotatedChecklist = (
  labels: readonly string[],
  flags: readonly number[],
  known: readonly number[],
): {
  witnessedCriteria: string[];
  knownMissingCriteria: string[];
  unknownCriteria: string[];
} => {
  aligned(labels, flags, "criteria");
  aligned(labels, known, "known");
  flags.forEach((v) => bounded(v, "flag", 0, 1));
  known.forEach((v) => bounded(v, "known", 0, 1));
  return {
    witnessedCriteria: labels.filter((_, i) => known[i] && flags[i]),
    knownMissingCriteria: labels.filter((_, i) => known[i] && !flags[i]),
    unknownCriteria: labels.filter((_, i) => !known[i]),
  };
};
export const empiricalConfusion = (
  actual: readonly number[],
  predicted: readonly number[],
  known: readonly number[],
): {
  correctKnownCount: number;
  incorrectKnownCount: number;
  unknownCount: number;
  observedKnownAccuracy: number;
} => {
  aligned(actual, predicted, "predictions");
  aligned(actual, known, "known");
  [actual, predicted, known].forEach((v) =>
    v.forEach((x) => bounded(x, "binary", 0, 1)),
  );
  const n = sum(known);
  positive(n, "knownpairedcases");
  const c = sum(actual.map((v, i) => known[i] * (v === predicted[i] ? 1 : 0)));
  return {
    correctKnownCount: c,
    incorrectKnownCount: n - c,
    unknownCount: known.length - n,
    observedKnownAccuracy: c / n,
  };
};
