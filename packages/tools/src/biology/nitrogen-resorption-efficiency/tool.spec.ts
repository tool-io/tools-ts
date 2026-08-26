import { describe, expect, it } from "vitest";
import {
  nitrogenResorptionEfficiencyExample,
  runNitrogenResorptionEfficiency,
} from "./tool.js";

describe("N Resorption Efficiency", () => {
  it("publishes an executable example", () =>
    expect(
      runNitrogenResorptionEfficiency(
        nitrogenResorptionEfficiencyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: nitrogenResorptionEfficiencyExample.output,
    }));
  it("returns one hundred when senesced leaves lose all nitrogen", () =>
    expect(
      runNitrogenResorptionEfficiency({
        greenLeafNMgG: 12,
        senescedLeafNMgG: 0,
      }),
    ).toEqual({
      ok: true,
      output: { nitrogenResorptionEfficiencyPercent: 100 },
    }));
  it("returns zero with no nitrogen loss", () =>
    expect(
      runNitrogenResorptionEfficiency({
        greenLeafNMgG: 9,
        senescedLeafNMgG: 9,
      }),
    ).toEqual({
      ok: true,
      output: { nitrogenResorptionEfficiencyPercent: 0 },
    }));
  it("keeps fractional efficiencies exact", () =>
    expect(
      runNitrogenResorptionEfficiency({
        greenLeafNMgG: 8,
        senescedLeafNMgG: 2,
      }),
    ).toEqual({
      ok: true,
      output: { nitrogenResorptionEfficiencyPercent: 75 },
    }));
  it("rejects a zero green leaf concentration with invalid_nutrients", () => {
    const result = runNitrogenResorptionEfficiency({
      greenLeafNMgG: 0,
      senescedLeafNMgG: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_nutrients");
  });
  it("rejects senesced concentrations above green with invalid_nutrients", () => {
    const result = runNitrogenResorptionEfficiency({
      greenLeafNMgG: 10,
      senescedLeafNMgG: 12,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_nutrients");
  });
  it("rejects negative concentrations", () => {
    const result = runNitrogenResorptionEfficiency({
      greenLeafNMgG: -1,
      senescedLeafNMgG: 0,
    });
    expect(result.ok).toBe(false);
  });
});
