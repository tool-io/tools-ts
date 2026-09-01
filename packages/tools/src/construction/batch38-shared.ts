export * from "../engineering/batch38-shared.js";
import { simpleError } from "../core/simple.js";
import { aligned, positive, nonnegative } from "../game/shared.js";
import { integer } from "../accounting/money.js";
import { sum } from "../horticulture/batch34-shared.js";
export const rebarCut = (
  cuts: readonly number[],
  length: number,
): {
  minimumBars: number;
  cutBarIndices: number[];
  unallocatedStockMm: number;
} => {
  positive(length, "stock");
  integer(length, "stock mm");
  if (
    !cuts.length ||
    cuts.length > 16 ||
    cuts.some((v) => !Number.isSafeInteger(v) || v <= 0 || v > length) ||
    length > 1e9
  )
    simpleError(
      "cuts",
      "1–16 positive integer cuts where cut ≤ stock ≤ 1e9 mm; no kerf rebar shearing model.",
    );
  const size = 1 << cuts.length,
    count = Array<number>(size).fill(100),
    used = Array<number>(size).fill(Infinity),
    previous = Array<number>(size).fill(0),
    chosen = Array<number>(size).fill(0),
    bar = Array<number>(size).fill(0);
  count[0] = 1;
  used[0] = 0;
  for (let mask = 1; mask < size; mask++)
    for (let i = 0; i < cuts.length; i++)
      if (mask & (1 << i)) {
        const p = mask ^ (1 << i),
          fit = used[p] + cuts[i] <= length,
          bins = count[p] + (fit ? 0 : 1),
          tail = fit ? used[p] + cuts[i] : cuts[i];
        if (bins < count[mask] || (bins === count[mask] && tail < used[mask])) {
          count[mask] = bins;
          used[mask] = tail;
          previous[mask] = p;
          chosen[mask] = i;
          bar[mask] = bins - 1;
        }
      }
  const assignment = Array<number>(cuts.length).fill(0);
  for (let mask = size - 1; mask; mask = previous[mask])
    assignment[chosen[mask]] = bar[mask];
  return {
    minimumBars: count[size - 1],
    cutBarIndices: assignment,
    unallocatedStockMm: count[size - 1] * length - sum(cuts),
  };
};
export const firstFit = (
  cuts: readonly number[],
  cutClasses: readonly string[],
  stocks: readonly number[],
  stockClasses: readonly string[],
  kerf: number,
): {
  pieceStockIndices: number[];
  usedStockIndices: number[];
  remainingUsedStockMm: number[];
  unassignedPieceIndices: number[];
} => {
  aligned(cuts, cutClasses, "pieces");
  aligned(stocks, stockClasses, "stock");
  if (cuts.length > 128 || stocks.length > 128)
    simpleError("work", "≤128 actual pieces/stock boards.");
  [...cuts, ...stocks].forEach((v) => {
    positive(v, "length");
    integer(v, "mm");
    if (v > 1e9) simpleError("length", "≤1e9mm.");
  });
  nonnegative(kerf, "kerf");
  integer(kerf, "kerf mm");
  if ([...cutClasses, ...stockClasses].some((v) => !v.trim()))
    simpleError(
      "material",
      "Explicit independently established material/grain classes.",
    );
  const remaining = [...stocks],
    used = new Set<number>(),
    assignment = Array<number>(cuts.length).fill(-1),
    order = cuts.map((_, i) => i).sort((i, j) => cuts[j] - cuts[i] || i - j);
  for (const i of order) {
    const j = stocks.findIndex(
      (_, j) =>
        stockClasses[j] === cutClasses[i] && remaining[j] >= cuts[i] + kerf,
    );
    if (j >= 0) {
      assignment[i] = j;
      remaining[j] -= cuts[i] + kerf;
      used.add(j);
    }
  }
  const usedIndices = [...used].sort((a, b) => a - b);
  return {
    pieceStockIndices: assignment,
    usedStockIndices: usedIndices,
    remainingUsedStockMm: usedIndices.map((i) => remaining[i]),
    unassignedPieceIndices: assignment.flatMap((v, i) => (v === -1 ? [i] : [])),
  };
};
