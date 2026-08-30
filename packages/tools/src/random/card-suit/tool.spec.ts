import { describe, expect, it } from "vitest";
import {
  calculateRandomCardSuit,
  randomCardSuitExample,
  randomCardSuitValueCount,
  runRandomCardSuit,
} from "./tool.js";

describe("Random Card Suit Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCardSuit(randomCardSuitExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "♠" } });
    expect(
      runRandomCardSuit(randomCardSuitExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "♣" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCardSuitValueCount },
        (_, index) =>
          calculateRandomCardSuit(
            () => (index + 0.5) / randomCardSuitValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCardSuitValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomCardSuit({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
