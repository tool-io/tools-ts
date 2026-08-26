import { describe, expect, it } from "vitest";
import { rightingMomentExample, runRightingMoment } from "./tool.js";

describe("Righting Moment Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runRightingMoment(rightingMomentExample.input)).toEqual({
      ok: true,
      output: { rightingMomentPoundFeet: 30000 },
    });
  });

  it("yields a negative capsize moment for a negative arm", () => {
    expect(
      runRightingMoment({ displacementPounds: 8000, rightingArmFeet: -1.5 }),
    ).toEqual({ ok: true, output: { rightingMomentPoundFeet: -12000 } });
  });

  it("yields zero moment for a zero arm", () => {
    expect(
      runRightingMoment({ displacementPounds: 5000, rightingArmFeet: 0 }),
    ).toEqual({ ok: true, output: { rightingMomentPoundFeet: 0 } });
  });

  it("scales linearly with arm and displacement", () => {
    expect(
      runRightingMoment({ displacementPounds: 4000, rightingArmFeet: 2.5 }),
    ).toEqual({ ok: true, output: { rightingMomentPoundFeet: 10000 } });
  });

  it("rejects zero displacement with a stable error", () => {
    expect(
      runRightingMoment({ displacementPounds: 0, rightingArmFeet: 3 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "displacementPounds" }],
      },
      ok: false,
    });
  });

  it("rejects negative displacement", () => {
    expect(
      runRightingMoment({ displacementPounds: -100, rightingArmFeet: 3 }).ok,
    ).toBe(false);
  });

  it("rejects non-finite arms", () => {
    expect(
      runRightingMoment({
        displacementPounds: 10000,
        rightingArmFeet: Number.NaN,
      }).ok,
    ).toBe(false);
    expect(
      runRightingMoment({
        displacementPounds: 10000,
        rightingArmFeet: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runRightingMoment({
        beamFt: 11,
        displacementPounds: 10000,
        rightingArmFeet: 3,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "beamFt" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runRightingMoment(null).ok).toBe(false);
    expect(runRightingMoment({ rightingArmFeet: 3 }).ok).toBe(false);
  });
});
