import { describe, expect, it } from "vitest";
import { applianceCostExample, runApplianceCost } from "./tool.js";
describe("appliance cost", () => {
  it("publishes an executable example", () =>
    expect(runApplianceCost(applianceCostExample.input)).toEqual({
      ok: true,
      output: applianceCostExample.output,
    }));
});
