import { describe, expect, it } from "vitest";
import { heatingCostExample, runHeatingCost } from "./tool.js";
describe("heating cost", () => {
  it("publishes an executable example", () =>
    expect(runHeatingCost(heatingCostExample.input)).toEqual({
      ok: true,
      output: heatingCostExample.output,
    }));
});
