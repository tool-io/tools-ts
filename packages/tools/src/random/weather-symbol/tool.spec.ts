import { describe, expect, it } from "vitest";
import {
  calculateRandomWeatherSymbol,
  randomWeatherSymbolExample,
  randomWeatherSymbolValueCount,
  runRandomWeatherSymbol,
} from "./tool.js";

describe("Random Weather Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomWeatherSymbol(randomWeatherSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "🌑" } });
    expect(
      runRandomWeatherSymbol(randomWeatherSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🌊" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomWeatherSymbolValueCount },
        (_, index) =>
          calculateRandomWeatherSymbol(
            () => (index + 0.5) / randomWeatherSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomWeatherSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomWeatherSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
