import { describe, expect, it } from "vitest";
import {
  adagradStepExample,
  calculateAdagradStep,
  runAdagradStep,
} from "./tool.js";

describe("Adagrad Step", () => {
  it("updates accumulated gradient state", () =>
    expect(calculateAdagradStep(1, 0.1, 0, 0.01, 1e-8)).toEqual(
      adagradStepExample.output.result,
    ));
  it("publishes an executable example", () =>
    expect(runAdagradStep(adagradStepExample.input)).toEqual({
      ok: true,
      output: adagradStepExample.output,
    }));
});
