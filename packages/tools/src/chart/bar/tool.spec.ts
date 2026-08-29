import { describe, expect, it } from "vitest";
import { barChartExample, runBarChart } from "./tool.js";

describe("chart/bar", () => {
  it("creates the canonical bar chart example", () => {
    expect(runBarChart(barChartExample.input)).toEqual({
      ok: true,
      output: barChartExample.output,
    });
  });

  it("rejects unsupported runtime options", () => {
    expect(
      runBarChart({
        ...barChartExample.input,
        orientation: "diagonal" as never,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_option", field: "orientation" }] },
      ok: false,
    });
  });
});
