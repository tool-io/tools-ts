import { describe, expect, it } from "vitest";
import { runMosfetThresholdVoltageBodyEffect } from "./tool.js";
describe("mosfet body effect calculator", () => {
  it("increases VT with positive body bias", () => {
    const r = runMosfetThresholdVoltageBodyEffect({
      bodyBiasV: 1,
      gammaV05: 0.4,
      phiFV: 0.6,
      vt0V: 0.7,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.thresholdVoltageV).toBeGreaterThan(0.7);
  });
});
