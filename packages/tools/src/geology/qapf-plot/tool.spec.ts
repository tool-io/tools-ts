import { describe, expect, it } from "vitest";
import { qapfPlotExample, runQapfPlot } from "./tool.js";

describe("qapf-plot", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runQapfPlot(qapfPlotExample.input)).toEqual({
      ok: true,
      output: qapfPlotExample.output,
    });
  });

  it("selects the foid triangle only when feldspars are absent", () => {
    const r = runQapfPlot({
      quartzVolPct: 10,
      alkaliFeldsparVolPct: 0,
      plagioclaseVolPct: 0,
      feldspathoidVolPct: 30,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.plotTriangle as string).toBe("qaf");
    expect(r.output.qNormalized as number).toBeCloseTo(25);
    expect(r.output.fNormalized as number).toBeCloseTo(75);
  });
  it("rejects mixed feldspar-foid modes and empty inputs", () => {
    expect(
      runQapfPlot({
        quartzVolPct: 0,
        alkaliFeldsparVolPct: 1,
        plagioclaseVolPct: 0,
        feldspathoidVolPct: 1,
      }).ok,
    ).toBe(false);
    expect(
      runQapfPlot({
        quartzVolPct: 0,
        alkaliFeldsparVolPct: 0,
        plagioclaseVolPct: 0,
        feldspathoidVolPct: 0,
      }).ok,
    ).toBe(false);
  });
});
