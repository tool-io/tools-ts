import { describe, expect, it } from "vitest";
import { runVolumeOfDistribution } from "./tool.js";

describe("Volume Of Distribution", () => {
  it("calculates a valid result", () =>
    expect(
      runVolumeOfDistribution({ doseMg: 100, plasmaConcentrationMgL: 5 }),
    ).toEqual({ ok: true, output: { volumeOfDistributionL: 20 } }));
  it("handles fractional concentrations", () =>
    expect(
      runVolumeOfDistribution({ doseMg: 75, plasmaConcentrationMgL: 2.5 }),
    ).toEqual({ ok: true, output: { volumeOfDistributionL: 30 } }));
  it("reports one when dose matches concentration", () =>
    expect(
      runVolumeOfDistribution({ doseMg: 4, plasmaConcentrationMgL: 4 }),
    ).toEqual({ ok: true, output: { volumeOfDistributionL: 1 } }));
  it("grows for low plasma concentrations", () =>
    expect(
      runVolumeOfDistribution({ doseMg: 2, plasmaConcentrationMgL: 0.008 }),
    ).toEqual({ ok: true, output: { volumeOfDistributionL: 250 } }));
  it("scales linearly with dose", () =>
    expect(
      runVolumeOfDistribution({ doseMg: 300, plasmaConcentrationMgL: 6 }),
    ).toEqual({ ok: true, output: { volumeOfDistributionL: 50 } }));
  it("rejects non-positive doses", () => {
    const result = runVolumeOfDistribution({
      doseMg: 0,
      plasmaConcentrationMgL: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_dose");
  });
  it("rejects non-positive concentrations", () => {
    const result = runVolumeOfDistribution({
      doseMg: 100,
      plasmaConcentrationMgL: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_concentration");
  });
});
