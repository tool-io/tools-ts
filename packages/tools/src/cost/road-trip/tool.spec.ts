import { describe, expect, it } from "vitest";
import { roadTripCostExample, runRoadTripCost } from "./tool.js";
describe("road trip cost", () => {
  it("publishes an executable example", () =>
    expect(runRoadTripCost(roadTripCostExample.input)).toEqual({
      ok: true,
      output: roadTripCostExample.output,
    }));
});
