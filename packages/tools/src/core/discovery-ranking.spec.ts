import { describe, expect, it } from "vitest";
import { boundedRank } from "./discovery-ranking.js";

describe("bounded discovery ranking", () => {
  it("matches a complete stable ranking for every page window", () => {
    let seed = 1729;
    const candidates = Array.from({ length: 301 }, (_, i) => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return { id: `tool-${i}`, score: (seed % 17) - 3 };
    });
    const expected = candidates
      .filter((c) => c.score >= 0)
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id, "en"));
    for (const capacity of [0, 1, 2, 10, 100, 300, 400]) {
      const result = boundedRank(
        candidates,
        capacity,
        (c) => c.score,
        (c) => c.id,
      );
      expect(result.total).toBe(expected.length);
      expect(result.entries.map((m) => m.candidate)).toEqual(
        expected.slice(0, capacity),
      );
    }
  });
  it("handles no candidates and no matches", () => {
    expect(boundedRank([], 10, () => 0, String)).toEqual({
      entries: [],
      total: 0,
    });
    expect(boundedRank([1, 2], 10, () => -1, String)).toEqual({
      entries: [],
      total: 0,
    });
  });
});
