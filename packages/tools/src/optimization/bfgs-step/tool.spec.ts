import { describe, expect, it } from "vitest";
import { bfgsStepExample, calculateBfgsStep, runBfgsStep } from "./tool.js";

describe("BFGS Step", () => {
  it("updates a scalar inverse Hessian", () =>
    expect(calculateBfgsStep(0, 1, -4, -2, 1, 1)).toEqual(
      bfgsStepExample.output.result,
    ));
  it("rejects nonpositive curvature", () =>
    expect(runBfgsStep({ ...bfgsStepExample.input, gradient: -5 }).ok).toBe(
      false,
    ));
  it("publishes an executable example", () =>
    expect(runBfgsStep(bfgsStepExample.input)).toEqual({
      ok: true,
      output: bfgsStepExample.output,
    }));
});
