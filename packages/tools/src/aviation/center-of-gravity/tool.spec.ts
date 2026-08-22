import { describe, expect, it } from "vitest";
import { centerOfGravityExample, runCenterOfGravity } from "./tool.js";

describe("center of gravity calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCenterOfGravity(centerOfGravityExample.input)).toEqual({
      ok: true,
      output: centerOfGravityExample.output,
    });
  });

  it("rejects zero total weight through execution", () => {
    expect(
      runCenterOfGravity({ totalMomentLbIn: 100, totalWeightLb: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_weight" }] },
      ok: false,
    });
  });
});
