import { describe, expect, it } from "vitest";
import { rightingArmGzExample, runRightingArmGz } from "./tool.js";

describe("righting arm gz calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRightingArmGz(rightingArmGzExample.input)).toEqual({
      ok: true,
      output: rightingArmGzExample.output,
    });
  });

  it("returns zero at zero heel", () => {
    expect(
      runRightingArmGz({ heelAngleDegrees: 0, metacentricHeightFeet: 5 }),
    ).toEqual({ ok: true, output: { rightingArmFeet: 0 } });
  });

  it("uses the GM sine approximation within its small-angle range", () => {
    const result = runRightingArmGz({
      heelAngleDegrees: 15,
      metacentricHeightFeet: 4.25,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rightingArmFeet).toBeCloseTo(
      4.25 * Math.sin(Math.PI / 12),
      12,
    );
  });

  it("scales linearly with metacentric height", () => {
    const base = runRightingArmGz({
      heelAngleDegrees: 10,
      metacentricHeightFeet: 3,
    });
    const doubled = runRightingArmGz({
      heelAngleDegrees: 10,
      metacentricHeightFeet: 6,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.rightingArmFeet).toBe(
      2 * (base.output.rightingArmFeet as number),
    );
  });

  it("rises with heel angle across the range", () => {
    const shallow = runRightingArmGz({
      heelAngleDegrees: 5,
      metacentricHeightFeet: 4,
    });
    const deep = runRightingArmGz({
      heelAngleDegrees: 15,
      metacentricHeightFeet: 4,
    });
    if (!shallow.ok || !deep.ok) throw new Error("expected success");
    expect(deep.output.rightingArmFeet).toBeGreaterThan(
      shallow.output.rightingArmFeet as number,
    );
  });

  it("accepts the inclusive boundaries of zero and fifteen degrees", () => {
    for (const heelAngleDegrees of [0, 15])
      expect(
        runRightingArmGz({ heelAngleDegrees, metacentricHeightFeet: 2 }).ok,
      ).toBe(true);
  });

  it("rejects heel angles outside the inclusive range through validation", () => {
    for (const heelAngleDegrees of [-0.1, 15.1])
      expect(
        runRightingArmGz({ heelAngleDegrees, metacentricHeightFeet: 4 }),
      ).toMatchObject({
        error: {
          issues: [{ code: "invalid_field", field: "heelAngleDegrees" }],
        },
        ok: false,
      });
  });

  it("rejects zero and negative metacentric heights with a stable code", () => {
    for (const metacentricHeightFeet of [0, -2])
      expect(
        runRightingArmGz({ heelAngleDegrees: 10, metacentricHeightFeet }),
      ).toMatchObject({
        error: {
          issues: [{ code: "invalid_input", field: "metacentricHeightFeet" }],
        },
        ok: false,
      });
  });

  it("rejects missing required inputs", () => {
    expect(runRightingArmGz({ metacentricHeightFeet: 4 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "heelAngleDegrees" }] },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { heelAngleDegrees: Number.NaN, metacentricHeightFeet: 4 },
      { heelAngleDegrees: 30, metacentricHeightFeet: Number.POSITIVE_INFINITY },
    ])
      expect(runRightingArmGz(bad).ok).toBe(false);
  });
});
