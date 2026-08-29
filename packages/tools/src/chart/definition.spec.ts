import { describe, expect, it } from "vitest";
import { createChartDocument, validateChartSpec } from "./definition.js";
import type { TableData } from "../table/definition.js";

const data: TableData = {
  kind: "tool.io/table",
  rows: [["A", 2]],
  schema: {
    fields: [
      { dataType: { kind: "string" }, id: "category", nullable: false },
      {
        dataType: { bits: 32, kind: "integer", signed: false },
        id: "count",
        nullable: false,
      },
    ],
  },
  version: 1,
};

describe("ChartSpec validation", () => {
  it("accepts a portable pie-chart specification", () => {
    expect(
      validateChartSpec({
        encoding: {
          category: { field: "category" },
          theta: { field: "count" },
        },
        kind: "tool.io/chart-spec",
        type: "pie",
        version: 1,
      }),
    ).toEqual([]);
  });

  it("rejects unknown channels and invalid bin counts", () => {
    expect(
      validateChartSpec({
        encoding: {
          radius: { field: "count" },
          x: { bin: 0, field: "count" },
        },
        kind: "tool.io/chart-spec",
        type: "histogram",
        version: 1,
      }).map(({ code }) => code),
    ).toEqual(
      expect.arrayContaining([
        "chart_channel_invalid",
        "invalid_chart_encoding",
      ]),
    );
  });

  it("rejects invalid axes, options, and scale domains", () => {
    expect(
      validateChartSpec({
        axes: { x: { grid: "yes" } },
        encoding: {
          x: {
            field: "count",
            scale: { maximum: 1, minimum: 2, type: "linear" },
          },
        },
        kind: "tool.io/chart-spec",
        options: { connectNulls: "yes" },
        type: "line",
        version: 1,
      }).map(({ code }) => code),
    ).toEqual(
      expect.arrayContaining([
        "invalid_chart_axes",
        "invalid_chart_encoding",
        "invalid_chart_options",
      ]),
    );
  });

  it("warns when radial encodings are incomplete", () => {
    expect(
      createChartDocument(data, {
        encoding: { category: { field: "category" } },
        kind: "tool.io/chart-spec",
        type: "pie",
        version: 1,
      }).warnings.map(({ code }) => code),
    ).toContain("radial_encodings_required");
  });

  it("warns when line-chart y data is not numeric", () => {
    expect(
      createChartDocument(data, {
        encoding: {
          x: { field: "count" },
          y: { field: "category" },
        },
        kind: "tool.io/chart-spec",
        type: "line",
        version: 1,
      }).warnings.map(({ code }) => code),
    ).toContain("numeric_y_required");
  });
});
