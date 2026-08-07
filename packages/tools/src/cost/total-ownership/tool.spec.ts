import { describe, expect, it } from "vitest";
import { runTotalOwnershipCost, totalOwnershipCostExample } from "./tool.js";
describe("total ownership cost", () => {
  it("publishes an executable example", () =>
    expect(runTotalOwnershipCost(totalOwnershipCostExample.input)).toEqual({
      ok: true,
      output: totalOwnershipCostExample.output,
    }));
});
