import { describe, expect, it } from "vitest";
import { projectCostExample, runProjectCost } from "./tool.js";
describe("project cost", () => {
  it("publishes an executable example", () =>
    expect(runProjectCost(projectCostExample.input)).toEqual({
      ok: true,
      output: projectCostExample.output,
    }));
});
