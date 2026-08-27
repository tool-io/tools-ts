import { describe, expect, it } from "vitest";
import {
  magneticAnomalyTotalFieldExample,
  runMagneticAnomalyTotalField,
} from "./tool.js";

describe("geology/magnetic-anomaly-total-field", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMagneticAnomalyTotalField(magneticAnomalyTotalFieldExample.input),
    ).toEqual({ ok: true, output: magneticAnomalyTotalFieldExample.output });
  });

  it("yields zero when observed equals the regional field", () => {
    const result = runMagneticAnomalyTotalField({
      observedTotalFieldNt: 50000,
      regionalFieldNt: 50000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.totalFieldAnomalyNt).toBe(0);
  });

  it("rejects non-positive field magnitudes", () => {
    expect(
      runMagneticAnomalyTotalField({
        observedTotalFieldNt: 0,
        regionalFieldNt: 50000,
      }).ok,
    ).toBe(false);
    expect(
      runMagneticAnomalyTotalField({
        observedTotalFieldNt: 50000,
        regionalFieldNt: -1,
      }).ok,
    ).toBe(false);
  });
});
