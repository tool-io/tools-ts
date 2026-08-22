import { describe, expect, it } from "vitest";
import { runCorrectedIasForWeight } from "./tool.js";
describe("corrected ias for weight", () => {
  it("scales IAS by square root of weight ratio", () => {
    const r = runCorrectedIasForWeight({
      currentWeightLb: 2400,
      iasKt: 100,
      referenceWeightLb: 2000,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.correctedIasKt).toBeCloseTo(
      Math.sqrt(2400 / 2000) * 100,
      9,
    );
  });
});
