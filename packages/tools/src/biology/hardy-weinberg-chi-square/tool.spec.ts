import { describe, expect, it } from "vitest";
import {
  hardyWeinbergChiSquareExample,
  runHardyWeinbergChiSquare,
} from "./tool.js";

describe("HW Chi-Square", () => {
  it("matches the canonical example", () => {
    expect(
      runHardyWeinbergChiSquare(hardyWeinbergChiSquareExample.input),
    ).toEqual({ ok: true, output: { chiSquare: 32 } });
  });
  it("returns zero for perfectly expected counts", () =>
    expect(
      runHardyWeinbergChiSquare({
        alleleFrequencyP: 0.5,
        observedHomoDominant: 25,
        observedHeterozygous: 50,
        observedHomoRecessive: 25,
      }),
    ).toEqual({ ok: true, output: { chiSquare: 0 } }));
  it("computes asymmetric deviations", () => {
    const result = runHardyWeinbergChiSquare({
      alleleFrequencyP: 0.6,
      observedHomoDominant: 36,
      observedHeterozygous: 48,
      observedHomoRecessive: 16,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.chiSquare).toBeCloseTo(0, 12);
  });
  it("handles skewed allele frequencies", () => {
    const result = runHardyWeinbergChiSquare({
      alleleFrequencyP: 0.9,
      observedHomoDominant: 81,
      observedHeterozygous: 18,
      observedHomoRecessive: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.chiSquare).toBeCloseTo(0, 12);
  });
  it("allows zero observed counts in one class", () =>
    expect(
      runHardyWeinbergChiSquare({
        alleleFrequencyP: 0.5,
        observedHomoDominant: 40,
        observedHeterozygous: 60,
        observedHomoRecessive: 0,
      }).ok,
    ).toBe(true));
  it("rejects all-zero observations", () =>
    expect(
      runHardyWeinbergChiSquare({
        alleleFrequencyP: 0.5,
        observedHomoDominant: 0,
        observedHeterozygous: 0,
        observedHomoRecessive: 0,
      }).ok,
    ).toBe(false));
  it("rejects p above one", () =>
    expect(
      runHardyWeinbergChiSquare({
        alleleFrequencyP: 1.1,
        observedHomoDominant: 10,
        observedHeterozygous: 10,
        observedHomoRecessive: 10,
      }).ok,
    ).toBe(false));
  it("rejects fixed allele frequencies with zero expected cells", () => {
    expect(
      runHardyWeinbergChiSquare({
        alleleFrequencyP: 0,
        observedHeterozygous: 0,
        observedHomoDominant: 0,
        observedHomoRecessive: 10,
      }).ok,
    ).toBe(false);
    expect(
      runHardyWeinbergChiSquare({
        alleleFrequencyP: 1,
        observedHeterozygous: 0,
        observedHomoDominant: 10,
        observedHomoRecessive: 0,
      }).ok,
    ).toBe(false);
  });
});
