import { describe, expect, it } from "vitest";
import {
  calculateRandomAstronomicalSymbol,
  randomAstronomicalSymbolExample,
  randomAstronomicalSymbolValueCount,
  runRandomAstronomicalSymbol,
} from "./tool.js";

describe("Random Astronomical Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAstronomicalSymbol(randomAstronomicalSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "☄" } });
    expect(
      runRandomAstronomicalSymbol(randomAstronomicalSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🝶" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAstronomicalSymbolValueCount },
        (_, index) =>
          calculateRandomAstronomicalSymbol(
            () => (index + 0.5) / randomAstronomicalSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAstronomicalSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomAstronomicalSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
