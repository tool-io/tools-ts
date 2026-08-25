import { describe, expect, it } from "vitest";
import { heelAngleExample, runHeelAngle } from "./tool.js";

describe("heel angle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHeelAngle(heelAngleExample.input)).toEqual({
      ok: true,
      output: heelAngleExample.output,
    });
  });

  it("returns ninety degrees when the ratio is exactly one", () => {
    expect(
      runHeelAngle({
        displacementPounds: 1000,
        heelingMomentFtLb: 1000,
        metacentricHeightFeet: 1,
      }),
    ).toEqual({ ok: true, output: { heelAngleDegrees: 90 } });
  });

  it("accepts the lower boundary of zero for all inputs", () => {
    expect(
      runHeelAngle({
        displacementPounds: 0,
        heelingMomentFtLb: 0,
        metacentricHeightFeet: 0,
      }).ok,
    ).toBe(false);
    const positive = runHeelAngle({
      displacementPounds: 1000,
      heelingMomentFtLb: 500,
      metacentricHeightFeet: 1,
    });
    if (!positive.ok) throw new Error("expected success");
    expect(positive.output.heelAngleDegrees).toBeGreaterThan(0);
  });

  it("returns zero heel for zero moment and rejects negative moments", () => {
    expect(
      runHeelAngle({
        displacementPounds: 1000,
        heelingMomentFtLb: 0,
        metacentricHeightFeet: 1,
      }),
    ).toEqual({ ok: true, output: { heelAngleDegrees: 0 } });
    expect(
      runHeelAngle({
        displacementPounds: 1000,
        heelingMomentFtLb: -10,
        metacentricHeightFeet: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "heelingMomentFtLb" }],
      },
      ok: false,
    });
  });

  it("rejects negative displacement through validation", () => {
    expect(
      runHeelAngle({
        displacementPounds: -5,
        heelingMomentFtLb: 100,
        metacentricHeightFeet: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "displacementPounds" }],
      },
      ok: false,
    });
  });

  it("rejects non-positive metacentric height with invalid_input", () => {
    expect(
      runHeelAngle({
        displacementPounds: 1000,
        heelingMomentFtLb: 100,
        metacentricHeightFeet: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "metacentricHeightFeet" }],
      },
      ok: false,
    });
  });

  it("reports capsize_risk when the ratio exceeds one", () => {
    expect(
      runHeelAngle({
        displacementPounds: 1000,
        heelingMomentFtLb: 2001,
        metacentricHeightFeet: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "capsize_risk", field: "heelingMomentFtLb" }] },
      ok: false,
    });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runHeelAngle({}).ok).toBe(false);
    expect(
      runHeelAngle({
        displacementPounds: "big",
        heelingMomentFtLb: 1,
        metacentricHeightFeet: 1,
      }).ok,
    ).toBe(false);
    expect(
      runHeelAngle({
        displacementPounds: Number.NaN,
        heelingMomentFtLb: 1,
        metacentricHeightFeet: 1,
      }).ok,
    ).toBe(false);
  });
});
