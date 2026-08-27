import { describe, expect, it } from "vitest";
import {
  holeCleaningEfficiencyExample,
  runHoleCleaningEfficiency,
} from "./tool.js";

describe("geology/hole-cleaning-efficiency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHoleCleaningEfficiency(holeCleaningEfficiencyExample.input),
    ).toEqual({
      ok: true,
      output: holeCleaningEfficiencyExample.output,
    });
  });

  it("yields perfect transport when cuttings have no slip", () => {
    const result = runHoleCleaningEfficiency({
      mudFlowRateCubicMetresPerSecond: 0.02,
      holeDiameterMetres: 0.31115,
      pipeOuterDiameterMetres: 0.127,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.holeCleaningEfficiencyPercent as number).toBe(100);
  });

  it("rejects non-positive flow rate and inverted geometry", () => {
    expect(
      runHoleCleaningEfficiency({
        mudFlowRateCubicMetresPerSecond: 0,
        holeDiameterMetres: 0.31115,
        pipeOuterDiameterMetres: 0.127,
      }).ok,
    ).toBe(false);
    expect(
      runHoleCleaningEfficiency({
        mudFlowRateCubicMetresPerSecond: 0.02,
        holeDiameterMetres: 0.1,
        pipeOuterDiameterMetres: 0.127,
      }).ok,
    ).toBe(false);
  });
});
