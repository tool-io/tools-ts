import { describe, expect, it } from "vitest";
import { lineChartExample, runLineChart } from "./tool.js";

describe("chart/line", () => {
  it("creates the canonical line-chart example", () => {
    expect(runLineChart(lineChartExample.input)).toEqual({
      ok: true,
      output: lineChartExample.output,
    });
  });

  it("rejects unknown and nonnumeric y fields", () => {
    const data = {
      ...lineChartExample.input.data,
      schema: {
        fields: [
          {
            dataType: { kind: "string" as const },
            id: "label",
            nullable: false,
          },
        ],
      },
      rows: [["A"]],
    };
    const result = runLineChart({ data, x: "missing", y: "label" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(
        result.error.issues.map(({ code, field }) => ({ code, field })),
      ).toEqual(
        expect.arrayContaining([
          { code: "unknown_table_field", field: "x" },
          { code: "numeric_field_required", field: "y" },
        ]),
      );
  });
});
