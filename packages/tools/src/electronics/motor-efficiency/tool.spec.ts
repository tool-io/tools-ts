import { describe, expect, it } from "vitest";
import {
  calculateMotorEfficiency,
  motorEfficiencyExample,
  runMotorEfficiency,
} from "./tool.js";

describe("motor efficiency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMotorEfficiency(motorEfficiencyExample.input)).toEqual({
      ok: true,
      output: motorEfficiencyExample.output,
    });
  });

  it("reports one hundred percent only for a lossless motor", () => {
    expect(
      calculateMotorEfficiency({
        electricalWatts: 40,
        mechanicalWatts: 40,
      }).efficiencyPercent,
    ).toBe(100);
  });

  it("halves the percent when mechanical output halves", () => {
    const full = calculateMotorEfficiency({
      electricalWatts: 60,
      mechanicalWatts: 30,
    }).efficiencyPercent;
    const half = calculateMotorEfficiency({
      electricalWatts: 60,
      mechanicalWatts: 15,
    }).efficiencyPercent;
    expect(half).toBe(full / 2);
  });

  it("matches mechanical over electrical times one hundred", () => {
    const electricalWatts = 88;
    const mechanicalWatts = 71.5;
    expect(
      calculateMotorEfficiency({ electricalWatts, mechanicalWatts })
        .efficiencyPercent,
    ).toBe((mechanicalWatts / electricalWatts) * 100);
  });

  it("guards zero electrical input with invalid_powers", () => {
    expect(
      runMotorEfficiency({ electricalWatts: 0, mechanicalWatts: 10 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_powers", field: "electricalWatts" }] },
      ok: false,
    });
  });

  it("guards output above input with invalid_powers", () => {
    expect(
      runMotorEfficiency({ electricalWatts: 50, mechanicalWatts: 51 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_powers", field: "mechanicalWatts" }] },
      ok: false,
    });
  });

  it("keeps realistic brushless motors in the eighty to ninety five band", () => {
    for (const mechanicalWatts of [80, 90, 95]) {
      const efficiency = calculateMotorEfficiency({
        electricalWatts: 100,
        mechanicalWatts,
      }).efficiencyPercent;
      expect(efficiency).toBeGreaterThanOrEqual(80);
      expect(efficiency).toBeLessThanOrEqual(95);
    }
  });
});
