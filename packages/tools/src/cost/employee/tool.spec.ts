import { describe, expect, it } from "vitest";
import { employeeCostExample, runEmployeeCost } from "./tool.js";
describe("employee cost", () => {
  it("publishes an executable example", () =>
    expect(runEmployeeCost(employeeCostExample.input)).toEqual({
      ok: true,
      output: employeeCostExample.output,
    }));
});
