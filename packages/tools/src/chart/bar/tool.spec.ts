import { describe, expect, it } from "vitest";
import { barChartExample, runBarChart } from "./tool.js";

describe("chart/bar", () => {
  it("creates the canonical bar chart example", () => {
    expect(runBarChart(barChartExample.input)).toEqual({
      ok: true,
      output: barChartExample.output,
    });
  });
});
