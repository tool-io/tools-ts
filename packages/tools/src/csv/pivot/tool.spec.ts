import { describe, expect, it } from "vitest";
import { calculatePivot, pivotExample, runPivot } from "./tool.js";

describe("CSV pivot table tool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPivot(pivotExample.input)).toEqual({
      ok: true,
      output: pivotExample.output,
    });
  });

  it("counts rows when no value column is needed", () => {
    const output = calculatePivot({
      aggregation: "count",
      csv: "region\nwest\neast\nwest",
      groupBy: ["region"],
    });
    expect(output.table).toEqual({
      columns: ["region", "count"],
      rows: [["east", 1], ["west", 2]],
    });
  });

  it("computes means over numeric values and skips empty cells", () => {
    const output = calculatePivot({
      aggregation: "mean",
      csv: "team,score\na,10\na,\nb,8\nb,12\n",
      groupBy: ["team"],
      valueColumn: "score",
    });
    expect(output.table).toEqual({
      columns: ["team", "score_mean"],
      rows: [["a", 10], ["b", 10]],
    });
  });

  it("groups by multiple columns in sorted order", () => {
    const output = calculatePivot({
      aggregation: "max",
      csv: "city,month,rain\noslo,jan,5\noslo,jan,9\noslo,feb,3\n",
      groupBy: ["city", "month"],
      valueColumn: "rain",
    });
    expect(output.table).toEqual({
      columns: ["city", "month", "rain_max"],
      rows: [
        ["oslo", "feb", 3],
        ["oslo", "jan", 9],
      ],
    });
  });

  it("rejects missing group columns, unknown columns, and bad values", () => {
    expect(
      runPivot({ aggregation: "count", csv: "a\n1", groupBy: [] }),
    ).toMatchObject({
      error: { issues: [{ code: "group_columns_required" }] },
      ok: false,
    });
    expect(
      runPivot({ aggregation: "count", csv: "a\n1", groupBy: ["b"] }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_column" }] },
      ok: false,
    });
    expect(
      runPivot({
        csv: "a,b\n1,x",
        groupBy: ["a"],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "value_column_required" }] },
      ok: false,
    });
    expect(
      runPivot({
        csv: "a,b\n1,x",
        groupBy: ["a"],
        valueColumn: "b",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "non_numeric_value" }] },
      ok: false,
    });
    expect(
      runPivot({
        csv: "a\n1",
        groupBy: ["a"],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "value_column_required" }] },
      ok: false,
    });
  });
});
