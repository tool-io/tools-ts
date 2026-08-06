import { describe, expect, it } from "vitest";
import {
  adaDeltaStepExample,
  calculateAdaDeltaStep,
  runAdaDeltaStep,
} from "./tool.js";

describe("AdaDelta Step", () => {
  it("updates both moving averages", () =>
    expect(calculateAdaDeltaStep(1, 0.1, 0, 0, 0.95, 0.000001)).toEqual(
      adaDeltaStepExample.output.result,
    ));
  it("publishes an executable example", () =>
    expect(runAdaDeltaStep(adaDeltaStepExample.input)).toEqual({
      ok: true,
      output: adaDeltaStepExample.output,
    }));
});
