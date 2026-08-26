import { describe, expect, it } from "vitest";
import {
  calculateTempoAdjustmentBongaartsFeeney,
  runTempoAdjustmentBongaartsFeeney,
  tempoAdjustmentBongaartsFeeneyExample,
} from "./tool.js";

describe("demography/tempo-adjustment-bongaarts-feeney", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTempoAdjustmentBongaartsFeeney(
        tempoAdjustmentBongaartsFeeneyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: tempoAdjustmentBongaartsFeeneyExample.output,
    });
  });

  it("deflates the TFR when childbearing is getting younger", () => {
    expect(
      calculateTempoAdjustmentBongaartsFeeney({
        observedTfr: 2,
        tempoAdjustmentR: -0.2,
      }).adjustedTfr,
    ).toBe(1.6666666666666667);
  });

  it("rejects non-positive TFRs and a vanishing divisor", () => {
    expect(
      runTempoAdjustmentBongaartsFeeney({ observedTfr: 0, tempoAdjustmentR: 0 })
        .ok,
    ).toBe(false);
    expect(
      runTempoAdjustmentBongaartsFeeney({ observedTfr: 2, tempoAdjustmentR: 1 })
        .ok,
    ).toBe(false);
    expect(
      runTempoAdjustmentBongaartsFeeney({
        observedTfr: 2,
        tempoAdjustmentR: 1.1,
      }).ok,
    ).toBe(false);
  });
});
