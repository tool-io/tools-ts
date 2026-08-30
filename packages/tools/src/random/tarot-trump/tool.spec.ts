import { describe, expect, it } from "vitest";
import {
  calculateRandomTarotTrump,
  randomTarotTrumpExample,
  randomTarotTrumpValueCount,
  runRandomTarotTrump,
} from "./tool.js";

describe("Random Tarot Trump Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTarotTrump(randomTarotTrumpExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "🃠" } });
    expect(
      runRandomTarotTrump(randomTarotTrumpExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🃵" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTarotTrumpValueCount },
        (_, index) =>
          calculateRandomTarotTrump(
            () => (index + 0.5) / randomTarotTrumpValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTarotTrumpValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTarotTrump({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
