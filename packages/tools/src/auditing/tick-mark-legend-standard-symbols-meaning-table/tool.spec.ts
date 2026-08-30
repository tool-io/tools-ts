import { describe, expect, it } from "vitest";
import {
  resolveTickMarkLegend,
  runTickMarkLegend,
  tickMarkLegendExample,
} from "./tool.js";

describe("tick mark legend standard symbols", () => {
  it("reproduces its canonical example", () => {
    expect(runTickMarkLegend(tickMarkLegendExample.input)).toEqual({
      ok: true,
      output: tickMarkLegendExample.output,
    });
  });

  it("matches marks without case sensitivity", () => {
    expect(
      resolveTickMarkLegend({
        legendMarks: ["A"],
        legendMeanings: ["Agreed"],
        usedMarks: [" a "],
      }).unresolvedMarks,
    ).toEqual([]);
  });

  it("counts each unresolved used mark", () => {
    expect(
      resolveTickMarkLegend({
        legendMarks: ["A"],
        legendMeanings: ["Agreed"],
        usedMarks: ["B", "C"],
      }),
    ).toMatchObject({ resolvedCount: 0, unresolvedCount: 2, usedMarkCount: 2 });
  });

  it("rejects duplicate legend marks", () => {
    expect(
      runTickMarkLegend({
        legendMarks: ["A", "a"],
        legendMeanings: ["One", "Two"],
        usedMarks: [],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "duplicate_legend_mark", field: "legendMarks.1" }],
      },
      ok: false,
    });
  });
});
