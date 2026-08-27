import { describe, expect, it } from "vitest";
import { unconformityAngleExample, runUnconformityAngle } from "./tool.js";

describe("unconformity-angle", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runUnconformityAngle(unconformityAngleExample.input)).toEqual({
      ok: true,
      output: unconformityAngleExample.output,
    });
  });

  it("is symmetric in its two dips", () => {
    const result = runUnconformityAngle({
      overlyingDipDeg: 40,
      underlyingDipDeg: 12,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.unconformityAngleDeg as number).toBe(28);
  });

  it("rejects out-of-range dips", () => {
    expect(
      runUnconformityAngle({ overlyingDipDeg: -3, underlyingDipDeg: 10 }).ok,
    ).toBe(false);
    expect(
      runUnconformityAngle({ overlyingDipDeg: 10, underlyingDipDeg: 91 }).ok,
    ).toBe(false);
  });
});
