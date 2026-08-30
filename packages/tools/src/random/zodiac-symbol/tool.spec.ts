import { describe, expect, it } from "vitest";
import {
  calculateRandomZodiacSymbol,
  randomZodiacSymbolExample,
  randomZodiacSymbolValueCount,
  runRandomZodiacSymbol,
} from "./tool.js";

describe("Random Zodiac Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomZodiacSymbol(randomZodiacSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "♈" } });
    expect(
      runRandomZodiacSymbol(randomZodiacSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "⛎" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomZodiacSymbolValueCount },
        (_, index) =>
          calculateRandomZodiacSymbol(
            () => (index + 0.5) / randomZodiacSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomZodiacSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomZodiacSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
