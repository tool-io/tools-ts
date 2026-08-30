import { simpleError } from "../core/simple.js";
import { bounded, aligned } from "../game/shared.js";
import { integer, money, signedSum, sumMoney } from "./money.js";
export * from "../game/shared.js";
export * from "./calendar.js";
export * from "./inventory.js";
export * from "./money.js";
export const unique = (labels: readonly string[], field: string): void => {
  if (
    !labels.length ||
    new Set(labels).size !== labels.length ||
    labels.some((s) => !s.trim() || s.length > 128)
  )
    simpleError(
      field,
      "Nonempty distinct explicit caller record labels required.",
    );
};
export const literal = (
  value: string,
  allowed: readonly string[],
  field: string,
): void => {
  if (!allowed.includes(value))
    simpleError(field, "Explicit supported policy/notation token required.");
};
export const entry = (
  accounts: readonly string[],
  signedDebits: readonly number[],
): {
  postingAccounts: string[];
  postingDebitsMinor: number[];
  postingCreditsMinor: number[];
} => {
  aligned(accounts, signedDebits, "posting");
  if (accounts.some((s) => !s.trim()))
    simpleError(
      "accounts",
      "Explicit nonempty posting account labels required.",
    );
  if (signedSum(signedDebits) !== 0)
    simpleError("posting", "Journal must reconcile to exact zero net debits.");
  return {
    postingAccounts: [...accounts],
    postingDebitsMinor: signedDebits.map((v) => Math.max(0, v)),
    postingCreditsMinor: signedDebits.map((v) => Math.max(0, -v)),
  };
};
export const allocateMinor = (
  total: number,
  weights: readonly number[],
): number[] => {
  money(total, "amount");
  weights.forEach((v) => bounded(v, "weight", 0, 1000000));
  const denominator = sumMoney(weights);
  if (!denominator)
    return simpleError(
      "weights",
      "Positive summed integer allocation weights required.",
    );
  const d = BigInt(denominator),
    t = BigInt(total),
    values = weights.map((w) => Number((t * BigInt(w)) / d)),
    remainders = weights
      .map((w, i) => ({ i, r: (t * BigInt(w)) % d }))
      .sort((a, b) => (a.r === b.r ? a.i - b.i : a.r > b.r ? -1 : 1)),
    left = total - sumMoney(values);
  for (let i = 0; i < left; i++) values[remainders[i].i]++;
  return values;
};
export const ageBuckets = (
  ages: readonly number[],
  upperInclusiveDays: readonly number[],
): number[] => {
  if (
    !upperInclusiveDays.length ||
    upperInclusiveDays.length > 128 ||
    upperInclusiveDays.some(
      (v, i) =>
        !Number.isSafeInteger(v) ||
        v < 0 ||
        (i > 0 && v <= upperInclusiveDays[i - 1]),
    )
  )
    simpleError(
      "edges",
      "1–128 strictly increasing nonnegative inclusive day edges required.",
    );
  return ages.map((v) => {
    integer(v, "age");
    let lo = 0,
      hi = upperInclusiveDays.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (v <= upperInclusiveDays[mid]) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  });
};
export const bandIndices = (
  values: readonly number[],
  upperInclusive: readonly number[],
): number[] => {
  if (
    !upperInclusive.length ||
    upperInclusive.length > 128 ||
    upperInclusive.some(
      (v, i) => !Number.isFinite(v) || (i > 0 && v <= upperInclusive[i - 1]),
    )
  )
    simpleError(
      "edges",
      "1–128 finite increasing caller band upper edges required.",
    );
  return values.map((v) => {
    let lo = 0,
      hi = upperInclusive.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (v <= upperInclusive[mid]) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  });
};
