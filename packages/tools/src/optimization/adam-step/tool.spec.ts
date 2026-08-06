import { describe, expect, it } from "vitest";
import { adamStepExample, calculateAdamStep, runAdamStep } from "./tool.js";

describe("Adam Step", () => {
  it("applies bias correction", () =>
    expect(calculateAdamStep(1, 0.1, 0, 0, 1, 0.001, 0.9, 0.999, 1e-8)).toEqual(
      adamStepExample.output.result,
    ));
  it("publishes an executable example", () =>
    expect(runAdamStep(adamStepExample.input)).toEqual({
      ok: true,
      output: adamStepExample.output,
    }));
});
