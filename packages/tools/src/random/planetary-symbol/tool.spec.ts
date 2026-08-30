import { describe, expect, it } from "vitest";
import {
  calculateRandomPlanetarySymbol,
  randomPlanetarySymbolExample,
  randomPlanetarySymbolValueCount,
  runRandomPlanetarySymbol,
} from "./tool.js";

describe("Random Planetary Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomPlanetarySymbol(randomPlanetarySymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "☉" } });
    expect(
      runRandomPlanetarySymbol(randomPlanetarySymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "⯖" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomPlanetarySymbolValueCount },
        (_, index) =>
          calculateRandomPlanetarySymbol(
            () => (index + 0.5) / randomPlanetarySymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPlanetarySymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomPlanetarySymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
