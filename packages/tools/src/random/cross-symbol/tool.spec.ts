import { describe, expect, it } from "vitest";
import {
  calculateRandomCrossSymbol,
  randomCrossSymbolExample,
  randomCrossSymbolValueCount,
  runRandomCrossSymbol,
} from "./tool.js";

describe("Random Cross Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCrossSymbol(randomCrossSymbolExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "☦" } });
    expect(
      runRandomCrossSymbol(randomCrossSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🮻" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCrossSymbolValueCount },
        (_, index) =>
          calculateRandomCrossSymbol(
            () => (index + 0.5) / randomCrossSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCrossSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomCrossSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
