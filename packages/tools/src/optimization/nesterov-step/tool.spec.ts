import { describe, expect, it } from "vitest";
import {
  calculateNesterovStep,
  nesterovStepExample,
  runNesterovStep,
} from "./tool.js";

describe("Nesterov Step", () => {
  it("calculates the lookahead and update", () =>
    expect(calculateNesterovStep(1, 0.2, 0.5, 0.1, 0.9)).toEqual(
      nesterovStepExample.output.result,
    ));
  it("publishes an executable example", () =>
    expect(runNesterovStep(nesterovStepExample.input)).toEqual({
      ok: true,
      output: nesterovStepExample.output,
    }));
});
