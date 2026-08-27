import { describe, expect, it } from "vitest";
import {
  nodalAnalysisInflowPerformanceExample,
  runNodalAnalysisInflowPerformance,
} from "./tool.js";

describe("geology/nodal-analysis-inflow-performance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNodalAnalysisInflowPerformance(
        nodalAnalysisInflowPerformanceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: nodalAnalysisInflowPerformanceExample.output,
    });
  });

  it("reaches the maximum rate at zero sandface pressure", () => {
    const result = runNodalAnalysisInflowPerformance({
      reservoirPressureMegapascals: 24,
      flowingBottomholePressureMegapascals: 0,
      productivityIndexCubicMetresPerDayPerMegapascal: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.inflowFlowRateCubicMetresPerDay as number).toBe(
      result.output.maximumFlowRateCubicMetresPerDay as number,
    );
  });

  it("rejects pressures above reservoir pressure and negative PI", () => {
    expect(
      runNodalAnalysisInflowPerformance({
        reservoirPressureMegapascals: 24,
        flowingBottomholePressureMegapascals: 30,
      }).ok,
    ).toBe(false);
    expect(
      runNodalAnalysisInflowPerformance({
        reservoirPressureMegapascals: 24,
        flowingBottomholePressureMegapascals: 12,
        productivityIndexCubicMetresPerDayPerMegapascal: -1,
      }).ok,
    ).toBe(false);
  });
});
