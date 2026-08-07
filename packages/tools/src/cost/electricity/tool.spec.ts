import { describe, expect, it } from "vitest";
import { electricityCostExample, runElectricityCost } from "./tool.js";
describe("electricity cost", () => {
  it("publishes an executable example", () =>
    expect(runElectricityCost(electricityCostExample.input)).toEqual({
      ok: true,
      output: electricityCostExample.output,
    }));
});
