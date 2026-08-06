import { describe, expect, it } from "vitest";
import { adaBoostExample, predictAdaBoost, runAdaBoost } from "./tool.js";
describe("AdaBoost", () => {
  it("publishes an executable example", () =>
    expect(runAdaBoost(adaBoostExample.input)).toEqual({
      ok: true,
      output: adaBoostExample.output,
    }));
  it("predicts from its model", () =>
    expect(predictAdaBoost(adaBoostExample.output.model, 4)).toBe(1));
});
