import { describe, expect, it } from "vitest";
import {
  phosphorusResorptionEfficiencyExample,
  runPhosphorusResorptionEfficiency,
} from "./tool.js";

describe("P Resorption Efficiency", () => {
  it("publishes an executable example", () =>
    expect(
      runPhosphorusResorptionEfficiency(
        phosphorusResorptionEfficiencyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: phosphorusResorptionEfficiencyExample.output,
    }));
  it("returns one hundred when senesced leaves lose all phosphorus", () =>
    expect(
      runPhosphorusResorptionEfficiency({
        greenLeafPMgG: 4,
        senescedLeafPMgG: 0,
      }),
    ).toEqual({
      ok: true,
      output: { phosphorusResorptionEfficiencyPercent: 100 },
    }));
  it("returns zero with no phosphorus loss", () =>
    expect(
      runPhosphorusResorptionEfficiency({
        greenLeafPMgG: 3,
        senescedLeafPMgG: 3,
      }),
    ).toEqual({
      ok: true,
      output: { phosphorusResorptionEfficiencyPercent: 0 },
    }));
  it("keeps fractional efficiencies exact", () =>
    expect(
      runPhosphorusResorptionEfficiency({
        greenLeafPMgG: 5,
        senescedLeafPMgG: 2.5,
      }),
    ).toEqual({
      ok: true,
      output: { phosphorusResorptionEfficiencyPercent: 50 },
    }));
  it("rejects a zero green leaf concentration with invalid_nutrients", () => {
    const result = runPhosphorusResorptionEfficiency({
      greenLeafPMgG: 0,
      senescedLeafPMgG: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_nutrients");
  });
  it("rejects senesced concentrations above green with invalid_nutrients", () => {
    const result = runPhosphorusResorptionEfficiency({
      greenLeafPMgG: 1.5,
      senescedLeafPMgG: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_nutrients");
  });
  it("rejects negative concentrations", () => {
    const result = runPhosphorusResorptionEfficiency({
      greenLeafPMgG: 2.5,
      senescedLeafPMgG: -1,
    });
    expect(result.ok).toBe(false);
  });
});
