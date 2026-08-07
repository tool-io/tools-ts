import { describe, expect, it } from "vitest";
import { apiCostExample, runApiCost } from "./tool.js";
describe("API cost", () => {
  it("publishes an executable example", () =>
    expect(runApiCost(apiCostExample.input)).toEqual({
      ok: true,
      output: apiCostExample.output,
    }));
});
