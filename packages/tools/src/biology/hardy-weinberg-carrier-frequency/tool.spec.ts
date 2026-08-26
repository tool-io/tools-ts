import { describe, expect, it } from "vitest";
import {
  hardyWeinbergCarrierFrequencyExample,
  runHardyWeinbergCarrierFrequency,
} from "./tool.js";

describe("Carrier Frequency", () => {
  it("matches the canonical example", () => {
    const result = runHardyWeinbergCarrierFrequency(
      hardyWeinbergCarrierFrequencyExample.input,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.carrierFrequency).toBeCloseTo(0.32, 12);
  });
  it("computes carriers for cystic fibrosis-like incidence", () => {
    const result = runHardyWeinbergCarrierFrequency({
      recessiveDiseaseIncidence: 0.000025,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.carrierFrequency).toBeCloseTo(0.00995, 12);
  });
  it("shrinks toward zero as incidence approaches one", () => {
    const result = runHardyWeinbergCarrierFrequency({
      recessiveDiseaseIncidence: 0.01,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.carrierFrequency).toBeCloseTo(0.18, 12);
  });
  it("is symmetric around incidence one quarter", () => {
    const lower = runHardyWeinbergCarrierFrequency({
      recessiveDiseaseIncidence: 0.09,
    });
    const upper = runHardyWeinbergCarrierFrequency({
      recessiveDiseaseIncidence: 0.49,
    });
    expect(lower.ok && upper.ok).toBe(true);
    if (lower.ok && upper.ok)
      expect(lower.output.carrierFrequency).toBeCloseTo(
        Number(upper.output.carrierFrequency),
        12,
      );
  });
  it("returns zero carriers when the recessive allele is absent", () =>
    expect(
      runHardyWeinbergCarrierFrequency({ recessiveDiseaseIncidence: 0 }),
    ).toEqual({ ok: true, output: { carrierFrequency: 0 } }));
  it("returns zero carriers when the recessive allele is fixed", () =>
    expect(
      runHardyWeinbergCarrierFrequency({ recessiveDiseaseIncidence: 1 }),
    ).toEqual({ ok: true, output: { carrierFrequency: 0 } }));
  it("rejects incidence above one", () =>
    expect(
      runHardyWeinbergCarrierFrequency({ recessiveDiseaseIncidence: 1.2 }).ok,
    ).toBe(false));
});
