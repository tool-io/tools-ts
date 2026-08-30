import { simpleError } from "../core/simple.js";
export type Card = { rank: number; suit: string; name: string };
export const cards = (names: readonly string[], expected?: number): Card[] => {
  if (
    !names.length ||
    names.length > 52 ||
    (expected !== undefined && names.length !== expected) ||
    new Set(names).size !== names.length
  )
    return simpleError(
      "cards",
      "Distinct bounded cards in rank/suit notation 2–9/T/J/Q/K/A then C/D/H/S required.",
    );
  return names.map((name) => {
    if (!/^[2-9TJQKA][CDHS]$(?![\s\S])/.test(name))
      return simpleError(
        "cards",
        "Use exact ASCII rank/suit notation, e.g. AS or TD.",
      );
    return { rank: "23456789TJQKA".indexOf(name[0]) + 2, suit: name[1], name };
  });
};
export const poker = (
  names: readonly string[],
): { category: string; rank: number; tieBreakRanks: number[] } => {
  const hand = cards(names, 5),
    counts = new Map<number, number>();
  hand.forEach((c) => counts.set(c.rank, (counts.get(c.rank) ?? 0) + 1));
  const groups = [...counts].sort((a, b) => b[1] - a[1] || b[0] - a[0]),
    sorted = hand.map((c) => c.rank).sort((a, b) => b - a),
    flush = hand.every((c) => c.suit === hand[0].suit),
    unique = [...counts.keys()].sort((a, b) => a - b),
    straight =
      unique.length === 5 &&
      (unique[4] - unique[0] === 4 || unique.join(",") === "2,3,4,5,14"),
    high = unique.join(",") === "2,3,4,5,14" ? 5 : unique[4];
  const rank =
    straight && flush
      ? 8
      : groups[0][1] === 4
        ? 7
        : groups[0][1] === 3 && groups[1][1] === 2
          ? 6
          : flush
            ? 5
            : straight
              ? 4
              : groups[0][1] === 3
                ? 3
                : groups[0][1] === 2 && groups[1][1] === 2
                  ? 2
                  : groups[0][1] === 2
                    ? 1
                    : 0;
  return {
    category: [
      "high-card",
      "pair",
      "two-pair",
      "three-of-a-kind",
      "straight",
      "flush",
      "full-house",
      "four-of-a-kind",
      "straight-flush",
    ][rank],
    rank,
    tieBreakRanks: straight
      ? [high]
      : rank === 5 || rank === 0
        ? sorted
        : groups.map((g) => g[0]),
  };
};
export const cribbage = (
  handNames: readonly string[],
  starterName: string,
  isCrib: boolean,
): {
  fifteensPoints: number;
  pairsPoints: number;
  runsPoints: number;
  flushPoints: number;
  nobsPoints: number;
  handTotalPoints: number;
  dealerHeelsPoints: number;
} => {
  const all = cards([...handNames, starterName], 5);
  if (handNames.length !== 4)
    return simpleError(
      "hand",
      "Four original hand cards and one distinct starter required.",
    );
  const hand = all.slice(0, 4),
    starter = all[4];
  let fifteen = 0,
    pairs = 0,
    longest = 0,
    runs = 0;
  for (let i = 0; i < 5; i++)
    for (let j = i + 1; j < 5; j++) if (all[i].rank === all[j].rank) pairs += 2;
  for (let mask = 1; mask < 32; mask++) {
    const subset = all.filter((_, i) => mask & (1 << i));
    if (
      subset.reduce(
        (s, c) => s + (c.rank === 14 ? 1 : Math.min(c.rank, 10)),
        0,
      ) === 15
    )
      fifteen += 2;
    const ranks = subset
      .map((c) => (c.rank === 14 ? 1 : c.rank))
      .sort((a, b) => a - b);
    if (
      ranks.length >= 3 &&
      ranks.every((v, i) => i === 0 || v === ranks[i - 1] + 1)
    ) {
      if (ranks.length > longest) {
        longest = ranks.length;
        runs = 1;
      } else if (ranks.length === longest) runs++;
    }
  }
  const run = longest * runs,
    same = hand.every((c) => c.suit === hand[0].suit),
    flush = same ? (starter.suit === hand[0].suit ? 5 : isCrib ? 0 : 4) : 0,
    nobs = hand.some((c) => c.rank === 11 && c.suit === starter.suit) ? 1 : 0;
  return {
    fifteensPoints: fifteen,
    pairsPoints: pairs,
    runsPoints: run,
    flushPoints: flush,
    nobsPoints: nobs,
    handTotalPoints: fifteen + pairs + run + flush + nobs,
    dealerHeelsPoints: starter.rank === 11 ? 2 : 0,
  };
};
