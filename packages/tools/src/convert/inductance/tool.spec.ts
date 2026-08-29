import { describe, expect, it } from "vitest";
import { measureFactors } from "./factors.js";
import { convertInductance, inductanceExample, runInductance } from "./tool.js";

describe("convert inductance", () => {
  it("executes its canonical example exactly", () => {
    expect(runInductance(inductanceExample.input)).toEqual({
      ok: true,
      output: inductanceExample.output,
    });
  });

  it("converts henries to microhenries exactly", () => {
    expect(convertInductance(2, "H", "uH")).toBe(2000000);
  });

  it("inverts its own conversion for nanohenries", () => {
    expect(
      convertInductance(convertInductance(350, "nH", "H")!, "H", "nH"),
    ).toBeCloseTo(350, 9);
  });

  it("offers all SI prefixes plus CGS and equivalent-unit notation", () => {
    expect(Object.keys(measureFactors)).toHaveLength(32);
    expect(convertInductance(1, "abhenry", "nH")).toBe(1);
    expect(convertInductance(1, "stathenry", "H")).toBe(8.987552e11);
    expect(convertInductance(1, "Wb/A", "H")).toBe(1);
    expect(convertInductance(1, "V*s/A", "ohm*s")).toBe(1);
    expect(convertInductance(1, "µH", "uH")).toBe(1);
  });

  it("keeps extreme SI prefixes available without returning infinity", () => {
    expect(convertInductance(1, "QH", "qH")).toBe(1e60);
    expect(convertInductance(Number.MAX_VALUE, "QH", "H")).toBeNull();
  });

  it("returns null for unknown units", () => {
    expect(convertInductance(1, "H", "weber")).toBeNull();
  });

  it("rejects non-finite values at the boundary", () => {
    expect(
      runInductance({ fromUnit: "H", toUnit: "mH", value: NaN }),
    ).toMatchObject({ ok: false });
    expect(
      runInductance({ fromUnit: "H", toUnit: "mH", value: Infinity }),
    ).toMatchObject({ ok: false });
    expect(
      runInductance({ fromUnit: "henry", toUnit: "mH", value: 1 }),
    ).toMatchObject({ ok: false });
  });
});
