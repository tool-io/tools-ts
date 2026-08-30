import { describe, expect, it } from "vitest";
import {
  calculateRandomRecyclingSymbol,
  randomRecyclingSymbolExample,
  randomRecyclingSymbolValueCount,
  runRandomRecyclingSymbol,
} from "./tool.js";

describe("Random Recycling Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomRecyclingSymbol(randomRecyclingSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "♲" } });
    expect(
      runRandomRecyclingSymbol(randomRecyclingSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "♻" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomRecyclingSymbolValueCount },
        (_, index) =>
          calculateRandomRecyclingSymbol(
            () => (index + 0.5) / randomRecyclingSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomRecyclingSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomRecyclingSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
