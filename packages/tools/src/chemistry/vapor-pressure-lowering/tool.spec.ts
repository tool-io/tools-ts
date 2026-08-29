import { describe, expect, it } from "vitest";
import {
  runVaporPressureLowering,
  vaporPressureLoweringExample,
} from "./tool.js";
describe("Vapor Pressure Lowering", () => {
  it("publishes an executable example", () =>
    expect(
      runVaporPressureLowering(vaporPressureLoweringExample.input),
    ).toEqual({
      ok: true,
      output: vaporPressureLoweringExample.output,
    }));
  it("maps a half mole fraction to fifty percent", () =>
    expect(runVaporPressureLowering({ moleFractionSolute: 0.5 })).toEqual({
      ok: true,
      output: { vaporPressureLoweringPercent: 50 },
    }));
  it("allows no solute at all", () =>
    expect(runVaporPressureLowering({ moleFractionSolute: 0 })).toEqual({
      ok: true,
      output: { vaporPressureLoweringPercent: 0 },
    }));
  it("allows pure solute at the upper bound", () =>
    expect(runVaporPressureLowering({ moleFractionSolute: 1 })).toEqual({
      ok: true,
      output: { vaporPressureLoweringPercent: 100 },
    }));
  it("accepts fractional mole fractions", () => {
    const result = runVaporPressureLowering({ moleFractionSolute: 1 / 3 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.vaporPressureLoweringPercent).toBeCloseTo(
        33.33333333333333,
        12,
      );
  });
  it("rejects mole fractions above one", () =>
    expect(runVaporPressureLowering({ moleFractionSolute: 1.5 }).ok).toBe(
      false,
    ));
  it("rejects negative mole fractions", () =>
    expect(runVaporPressureLowering({ moleFractionSolute: -0.25 }).ok).toBe(
      false,
    ));
});
