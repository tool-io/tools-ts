import { describe, expect, it } from "vitest";
import {
  calculateRandomMoonPhaseSymbol,
  randomMoonPhaseSymbolExample,
  randomMoonPhaseSymbolValueCount,
  runRandomMoonPhaseSymbol,
} from "./tool.js";

describe("Random Moon Phase Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMoonPhaseSymbol(randomMoonPhaseSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "🌑" } });
    expect(
      runRandomMoonPhaseSymbol(randomMoonPhaseSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🌘" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMoonPhaseSymbolValueCount },
        (_, index) =>
          calculateRandomMoonPhaseSymbol(
            () => (index + 0.5) / randomMoonPhaseSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMoonPhaseSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMoonPhaseSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
