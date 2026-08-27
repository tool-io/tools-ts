import { describe, expect, it } from "vitest";
import { tasDiagramPlotExample, runTasDiagramPlot } from "./tool.js";

describe("tas-diagram-plot", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTasDiagramPlot(tasDiagramPlotExample.input)).toEqual({
      ok: true,
      output: tasDiagramPlotExample.output,
    });
  });

  it("classifies silica bands at breakpoints", () => {
    const bands = ([44.9, 45, 51.9, 52, 62.9, 63, 70] as const).map(
      (siO2WtPercent) => {
        const r = runTasDiagramPlot({
          siO2WtPercent,
          na2OWtPercent: 1,
          k2OWtPercent: 1,
        });
        if (!r.ok) throw new Error("expected success");
        return r.output.silicaBand as string;
      },
    );
    expect(bands).toEqual([
      "ultrabasic",
      "basic",
      "basic",
      "intermediate",
      "intermediate",
      "acid",
      "acid",
    ]);
  });
  it("rejects negative oxides", () => {
    expect(
      runTasDiagramPlot({
        siO2WtPercent: -1,
        na2OWtPercent: 1,
        k2OWtPercent: 1,
      }).ok,
    ).toBe(false);
  });
});
