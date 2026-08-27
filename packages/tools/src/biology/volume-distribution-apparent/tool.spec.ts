import { describe, expect, it } from "vitest";
import { runVolumeDistributionApparent } from "./tool.js";

describe("Apparent Vd", () => {
  it("calculates a valid result", () =>
    expect(
      runVolumeDistributionApparent({ doseMg: 100, plasmaConcMgL: 4 }),
    ).toEqual({
      ok: true,
      output: { apparentVolumeL: 25 },
    }));
  it("defaults to full bioavailability", () => {
    const result = runVolumeDistributionApparent({
      bioavailabilityFraction: 1,
      doseMg: 100,
      plasmaConcMgL: 4,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.apparentVolumeL).toBe(25);
  });
  it("uses the systemically available dose for partial bioavailability", () =>
    expect(
      runVolumeDistributionApparent({
        bioavailabilityFraction: 0.5,
        doseMg: 100,
        plasmaConcMgL: 2,
      }),
    ).toEqual({
      ok: true,
      output: { apparentVolumeL: 25 },
    }));
  it("scales inversely with the plasma concentration", () => {
    const result = runVolumeDistributionApparent({
      doseMg: 500,
      plasmaConcMgL: 10,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.apparentVolumeL).toBe(50);
  });
  it("rejects a zero dose", () => {
    const result = runVolumeDistributionApparent({
      doseMg: 0,
      plasmaConcMgL: 4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_dose");
  });
  it("rejects a zero plasma concentration", () => {
    const result = runVolumeDistributionApparent({
      doseMg: 100,
      plasmaConcMgL: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_concentration");
  });
  it("rejects a zero bioavailability fraction", () => {
    const result = runVolumeDistributionApparent({
      bioavailabilityFraction: 0,
      doseMg: 100,
      plasmaConcMgL: 4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_fraction");
  });
  it("rejects fractions above one", () =>
    expect(
      runVolumeDistributionApparent({
        bioavailabilityFraction: 1.25,
        doseMg: 100,
        plasmaConcMgL: 4,
      }).ok,
    ).toBe(false));
});
