import { describe, expect, it } from "vitest";
import { matthiessenMobilityExample, runMatthiessenMobility } from "./tool.js";

describe("Matthiessen Rule Mobility Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runMatthiessenMobility(matthiessenMobilityExample.input)).toEqual({
      ok: true,
      output: matthiessenMobilityExample.output,
    }));

  it("returns the single component unchanged", () =>
    expect(runMatthiessenMobility({ mobilityComponents: [1400] })).toEqual({
      ok: true,
      output: { mobilityCm2PerVs: 1400 },
    }));

  it("combines three components exactly", () =>
    expect(
      runMatthiessenMobility({ mobilityComponents: [1400, 400, 100] }),
    ).toEqual({
      ok: true,
      output: { mobilityCm2PerVs: 75.67567567567568 },
    }));

  it("is order independent", () => {
    const forward = runMatthiessenMobility({
      mobilityComponents: [100, 200],
    });
    const backward = runMatthiessenMobility({
      mobilityComponents: [200, 100],
    });
    expect(forward).toEqual(backward);
  });

  it("never exceeds the smallest component", () => {
    const result = runMatthiessenMobility({
      mobilityComponents: [50, 10000],
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.mobilityCm2PerVs).toBeLessThanOrEqual(50);
    expect(result.output.mobilityCm2PerVs).toBeCloseTo(49.75124378109453, 9);
  });

  it("reports empty_mobilities for an empty list", () =>
    expect(runMatthiessenMobility({ mobilityComponents: [] })).toMatchObject({
      error: { issues: [{ code: "empty_mobilities" }] },
      ok: false,
    }));

  it("reports invalid_mobility for zero components", () =>
    expect(
      runMatthiessenMobility({ mobilityComponents: [1400, 0] }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_mobility" }] },
      ok: false,
    }));

  it("reports invalid_mobility for negative components", () =>
    expect(
      runMatthiessenMobility({ mobilityComponents: [-100] }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_mobility" }] },
      ok: false,
    }));

  it("rejects non-finite components through validation", () =>
    expect(
      runMatthiessenMobility({
        mobilityComponents: [Number.NaN, 1400],
      }).ok,
    ).toBe(false));

  it("rejects non-list components", () =>
    expect(
      runMatthiessenMobility({
        mobilityComponents: 1400,
      }).ok,
    ).toBe(false));

  it("rejects missing components", () =>
    expect(runMatthiessenMobility({})).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));
});
