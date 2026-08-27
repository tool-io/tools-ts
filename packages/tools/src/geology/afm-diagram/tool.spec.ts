import { describe, expect, it } from "vitest";
import { afmDiagramExample, runAfmDiagram } from "./tool.js";

describe("afm-diagram", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAfmDiagram(afmDiagramExample.input)).toEqual({
      ok: true,
      output: afmDiagramExample.output,
    });
  });

  it("sums A, F and M percentages to one hundred", () => {
    const r = runAfmDiagram(afmDiagramExample.input);
    if (!r.ok) throw new Error("expected success");
    const o = r.output;
    expect(
      (o.aPercent as number) + (o.fPercent as number) + (o.mPercent as number),
    ).toBeCloseTo(100, 9);
  });
  it("rejects negative oxides and all-zero sums", () => {
    expect(
      runAfmDiagram({ ...afmDiagramExample.input, feOWtPercent: -1 }).ok,
    ).toBe(false);
    expect(
      runAfmDiagram({
        feOWtPercent: 0,
        fe2O3WtPercent: 0,
        mgoWtPercent: 0,
        na2OWtPercent: 0,
        k2OWtPercent: 0,
      }).ok,
    ).toBe(false);
  });
});
