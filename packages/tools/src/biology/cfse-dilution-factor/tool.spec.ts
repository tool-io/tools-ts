import { describe, expect, it } from "vitest";
import { runCfseDilutionFactor } from "./tool.js";

describe("CFSE Dilution Factor", () => {
  it("counts three divisions at one eighth fluorescence", () =>
    expect(
      runCfseDilutionFactor({
        currentFluorescence: 1250,
        initialFluorescence: 10000,
      }),
    ).toEqual({ ok: true, output: { divisionCount: 3 } }));
  it("counts a single division at half fluorescence", () =>
    expect(
      runCfseDilutionFactor({
        currentFluorescence: 5000,
        initialFluorescence: 10000,
      }),
    ).toEqual({ ok: true, output: { divisionCount: 1 } }));
  it("reports fractional divisions for partial peaks", () =>
    expect(
      runCfseDilutionFactor({
        currentFluorescence: 3000,
        initialFluorescence: 10000,
      }),
    ).toEqual({ ok: true, output: { divisionCount: 1.7369655941662063 } }));
  it("returns zero divisions for equal fluorescence", () =>
    expect(
      runCfseDilutionFactor({
        currentFluorescence: 8000,
        initialFluorescence: 8000,
      }),
    ).toEqual({ ok: true, output: { divisionCount: 0 } }));
  it("rejects increased fluorescence as no proliferation", () => {
    const result = runCfseDilutionFactor({
      currentFluorescence: 9000,
      initialFluorescence: 5000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("no_proliferation");
  });
  it("rejects zero current fluorescence", () => {
    const result = runCfseDilutionFactor({
      currentFluorescence: 0,
      initialFluorescence: 10000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_fluorescence");
  });
  it("rejects negative initial fluorescence", () => {
    const result = runCfseDilutionFactor({
      currentFluorescence: 100,
      initialFluorescence: -10000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_fluorescence");
  });
});
