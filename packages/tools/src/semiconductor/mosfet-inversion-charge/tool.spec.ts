import { describe, expect, it } from "vitest";
import {
  calculateMosfetInversionCharge,
  mosfetInversionChargeExample,
  runMosfetInversionCharge,
} from "./tool.js";

describe("mosfet inversion charge calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMosfetInversionCharge(mosfetInversionChargeExample.input),
    ).toEqual({ ok: true, output: mosfetInversionChargeExample.output });
  });

  it("converts fF/µm² to µC/cm²", () => {
    expect(
      calculateMosfetInversionCharge({
        coxFfPerUm2: 10,
        overdriveV: 2,
      }).inversionChargeUCm2,
    ).toBe(2);
  });

  it("is linear in overdrive voltage", () => {
    const q1 = calculateMosfetInversionCharge({
      coxFfPerUm2: 10,
      overdriveV: 1,
    }).inversionChargeUCm2;
    const q2 = calculateMosfetInversionCharge({
      coxFfPerUm2: 10,
      overdriveV: 2,
    }).inversionChargeUCm2;
    expect(q2).toBe(q1 * 2);
  });

  it("rejects non-positive capacitance", () => {
    expect(() =>
      calculateMosfetInversionCharge({ coxFfPerUm2: 0, overdriveV: 1 }),
    ).toThrow();
  });
});
