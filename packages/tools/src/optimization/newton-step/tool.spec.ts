import { describe, expect, it } from "vitest";
import {
  calculateNewtonStep,
  newtonStepExample,
  runNewtonStep,
} from "./tool.js";

describe("Newton Step", () => {
  it("updates a scalar parameter", () =>
    expect(calculateNewtonStep(4, 6, 2, 1)).toEqual({ parameter: 1, step: 3 }));
  it("rejects a zero Hessian", () =>
    expect(
      runNewtonStep({ damping: 1, gradient: 2, hessian: 0, parameter: 1 }).ok,
    ).toBe(false));
  it("publishes an executable example", () =>
    expect(runNewtonStep(newtonStepExample.input)).toEqual({
      ok: true,
      output: newtonStepExample.output,
    }));
});
