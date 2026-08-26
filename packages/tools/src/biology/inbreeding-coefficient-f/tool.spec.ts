import { describe, expect, it } from "vitest";
import {
  inbreedingCoefficientFExample,
  runInbreedingCoefficientF,
} from "./tool.js";

describe("Inbreeding Coefficient", () => {
  it("matches the canonical example", () => {
    const result = runInbreedingCoefficientF(
      inbreedingCoefficientFExample.input,
    );
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.inbreedingCoefficientF).toBeCloseTo(
        0.2857142857142857,
        12,
      );
  });
  it("returns zero when observed matches expected", () =>
    expect(
      runInbreedingCoefficientF({
        observedHeterozygosity: 0.5,
        expectedHeterozygosity: 0.5,
      }),
    ).toEqual({ ok: true, output: { inbreedingCoefficientF: 0 } }));
  it("returns one with no observed heterozygotes", () =>
    expect(
      runInbreedingCoefficientF({
        observedHeterozygosity: 0,
        expectedHeterozygosity: 0.25,
      }),
    ).toEqual({ ok: true, output: { inbreedingCoefficientF: 1 } }));
  it("may be negative under heterozygote excess", () => {
    const result = runInbreedingCoefficientF({
      observedHeterozygosity: 0.75,
      expectedHeterozygosity: 0.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.inbreedingCoefficientF).toBe(-0.5);
  });
  it("rejects zero expected heterozygosity", () =>
    expect(
      runInbreedingCoefficientF({
        observedHeterozygosity: 0,
        expectedHeterozygosity: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative expected heterozygosity", () =>
    expect(
      runInbreedingCoefficientF({
        observedHeterozygosity: 0.1,
        expectedHeterozygosity: -0.4,
      }).ok,
    ).toBe(false));
  it("rejects observed heterozygosity above one", () =>
    expect(
      runInbreedingCoefficientF({
        observedHeterozygosity: 1.2,
        expectedHeterozygosity: 0.5,
      }).ok,
    ).toBe(false));
});
