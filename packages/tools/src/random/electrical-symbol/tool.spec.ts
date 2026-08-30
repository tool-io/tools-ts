import { describe, expect, it } from "vitest";
import {
  calculateRandomElectricalSymbol,
  randomElectricalSymbolExample,
  randomElectricalSymbolValueCount,
  runRandomElectricalSymbol,
} from "./tool.js";

describe("Random Electrical Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomElectricalSymbol(randomElectricalSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "⏚" } });
    expect(
      runRandomElectricalSymbol(randomElectricalSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "💡" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomElectricalSymbolValueCount },
        (_, index) =>
          calculateRandomElectricalSymbol(
            () => (index + 0.5) / randomElectricalSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomElectricalSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomElectricalSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
