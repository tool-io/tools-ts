import { describe, expect, it } from "vitest";
import { printingCostExample, runPrintingCost } from "./tool.js";
describe("printing cost", () => {
  it("publishes an executable example", () =>
    expect(runPrintingCost(printingCostExample.input)).toEqual({
      ok: true,
      output: printingCostExample.output,
    }));
});
