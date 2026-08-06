import { describe, expect, it } from "vitest";
import {
  calculateRmspropStep,
  rmspropStepExample,
  runRmspropStep,
} from "./tool.js";

describe("RMSProp Step", () => {
  it("updates moving squared-gradient state", () =>
    expect(calculateRmspropStep(1, 0.1, 0, 0.001, 0.9, 1e-8)).toEqual(
      rmspropStepExample.output.result,
    ));
  it("publishes an executable example", () =>
    expect(runRmspropStep(rmspropStepExample.input)).toEqual({
      ok: true,
      output: rmspropStepExample.output,
    }));
});
