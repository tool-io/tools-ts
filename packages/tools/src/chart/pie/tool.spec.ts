import { describe, expect, it } from "vitest";
import { pieChartExample, runPieChart } from "./tool.js";

describe("chart/pie", () => {
  it("creates the canonical pie-chart example", () => {
    expect(runPieChart(pieChartExample.input)).toEqual({
      ok: true,
      output: pieChartExample.output,
    });
  });

  it("rejects negative values", () => {
    expect(
      runPieChart({
        ...pieChartExample.input,
        data: {
          ...pieChartExample.input.data,
          rows: [["Invalid", -1]],
          schema: {
            ...pieChartExample.input.data.schema,
            fields: [
              pieChartExample.input.data.schema.fields[0]!,
              {
                ...pieChartExample.input.data.schema.fields[1]!,
                dataType: { bits: 32, kind: "integer", signed: true },
              },
            ],
          },
        },
      }),
    ).toMatchObject({
      error: { issues: [{ code: "negative_pie_value", field: "value" }] },
      ok: false,
    });
  });
});
