import { describe, expect, it } from "vitest";
import {
  calculateRandomReligiousSymbol,
  randomReligiousSymbolExample,
  randomReligiousSymbolValueCount,
  runRandomReligiousSymbol,
} from "./tool.js";

describe("Random Religious Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomReligiousSymbol(randomReligiousSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "🛐" } });
    expect(
      runRandomReligiousSymbol(randomReligiousSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🪯" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomReligiousSymbolValueCount },
        (_, index) =>
          calculateRandomReligiousSymbol(
            () => (index + 0.5) / randomReligiousSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomReligiousSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomReligiousSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
