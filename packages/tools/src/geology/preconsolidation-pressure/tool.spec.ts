import { describe, expect, it } from "vitest";
import {
  preconsolidationPressureExample,
  runPreconsolidationPressure,
} from "./tool.js";

describe("preconsolidation-pressure", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPreconsolidationPressure(preconsolidationPressureExample.input),
    ).toEqual({
      ok: true,
      output: preconsolidationPressureExample.output,
    });
  });

  it("scales the overburden by a moderate OCR", () => {
    const result = runPreconsolidationPressure({
      overconsolidationRatio: 2,
      effectiveOverburdenStressKpa: 80,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.preconsolidationPressureKpa as number).toBe(160);
  });

  it("rejects a non-positive OCR", () => {
    expect(
      runPreconsolidationPressure({
        overconsolidationRatio: 0,
        effectiveOverburdenStressKpa: 100,
      }).ok,
    ).toBe(false);
  });
});
