import { describe, expect, it } from "vitest";
import {
  calculateRandomAlchemicalSymbol,
  randomAlchemicalSymbolExample,
  randomAlchemicalSymbolValueCount,
  runRandomAlchemicalSymbol,
} from "./tool.js";

describe("Random Alchemical Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAlchemicalSymbol(randomAlchemicalSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𜻒" } });
    expect(
      runRandomAlchemicalSymbol(randomAlchemicalSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🝳" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAlchemicalSymbolValueCount },
        (_, index) =>
          calculateRandomAlchemicalSymbol(
            () => (index + 0.5) / randomAlchemicalSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAlchemicalSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomAlchemicalSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
