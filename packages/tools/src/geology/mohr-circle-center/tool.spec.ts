import { describe, expect, it } from "vitest";
import { mohrCircleCenterExample, runMohrCircleCenter } from "./tool.js";

describe("mohr-circle-center", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMohrCircleCenter(mohrCircleCenterExample.input)).toEqual({
      ok: true,
      output: mohrCircleCenterExample.output,
    });
  });

  it("gives the common stress for equal principal stresses", () => {
    const result = runMohrCircleCenter({ sigma1MPa: 50, sigma3MPa: 50 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.centerNormalStressMPa as number).toBe(50);
  });

  it("rejects sigma_3 greater than sigma_1", () => {
    expect(runMohrCircleCenter({ sigma1MPa: 40, sigma3MPa: 120 }).ok).toBe(
      false,
    );
  });
});
