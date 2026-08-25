import { describe, expect, it } from "vitest";
import { runAlveolarGasEquation } from "./tool.js";

describe("Alveolar Gas Equation", () => {
  it("calculates sea-level room air by default", () =>
    expect(
      runAlveolarGasEquation({
        fiO2Fraction: 0.21,
        patmMmhg: 760,
        paco2Mmhg: 40,
      }),
    ).toEqual({
      ok: true,
      output: { alveolarPo2Mmhg: 99.72999999999999 },
    }));
  it("reproduces the defaults explicitly", () => {
    const implicit = runAlveolarGasEquation({
      fiO2Fraction: 0.21,
      patmMmhg: 760,
      paco2Mmhg: 40,
    });
    const explicit = runAlveolarGasEquation({
      fiO2Fraction: 0.21,
      patmMmhg: 760,
      paco2Mmhg: 40,
      ph2oMmhg: 47,
      respiratoryQuotient: 0.8,
    });
    expect(explicit).toEqual(implicit);
  });
  it("gives pure oxygen breathing its full humidified pressure minus CO2 term", () => {
    const result = runAlveolarGasEquation({
      fiO2Fraction: 1,
      patmMmhg: 760,
      paco2Mmhg: 40,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.alveolarPo2Mmhg).toBe(663);
  });
  it("falls with altitude", () => {
    const result = runAlveolarGasEquation({
      fiO2Fraction: 0.21,
      patmMmhg: 380,
      paco2Mmhg: 30,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.alveolarPo2Mmhg).toBeCloseTo(
        0.21 * (380 - 47) - 30 / 0.8,
        12,
      );
  });
  it("rises as PaCO2 falls with hyperventilation", () => {
    const normal = runAlveolarGasEquation({
      fiO2Fraction: 0.21,
      patmMmhg: 760,
      paco2Mmhg: 40,
    });
    const low = runAlveolarGasEquation({
      fiO2Fraction: 0.21,
      patmMmhg: 760,
      paco2Mmhg: 20,
    });
    expect(normal.ok && low.ok).toBe(true);
    if (normal.ok && low.ok)
      expect(Number(low.output.alveolarPo2Mmhg)).toBeGreaterThan(
        Number(normal.output.alveolarPo2Mmhg),
      );
  });
  it("accepts the respiratory quotient bounds", () => {
    expect(
      runAlveolarGasEquation({
        fiO2Fraction: 0.21,
        patmMmhg: 760,
        paco2Mmhg: 40,
        respiratoryQuotient: 0.7,
      }).ok,
    ).toBe(true);
    expect(
      runAlveolarGasEquation({
        fiO2Fraction: 0.21,
        patmMmhg: 760,
        paco2Mmhg: 40,
        respiratoryQuotient: 1,
      }).ok,
    ).toBe(true);
  });
  it("rejects FiO2 above one", () =>
    expect(
      runAlveolarGasEquation({
        fiO2Fraction: 1.1,
        patmMmhg: 760,
        paco2Mmhg: 40,
      }).ok,
    ).toBe(false));
  it("rejects non-positive atmospheric pressure and PaCO2", () => {
    expect(
      runAlveolarGasEquation({ fiO2Fraction: 0.21, patmMmhg: 0, paco2Mmhg: 40 })
        .ok,
    ).toBe(false);
    expect(
      runAlveolarGasEquation({
        fiO2Fraction: 0.21,
        patmMmhg: 760,
        paco2Mmhg: 0,
      }).ok,
    ).toBe(false);
  });
  it("rejects respiratory quotient outside zero point seven to one", () =>
    expect(
      runAlveolarGasEquation({
        fiO2Fraction: 0.21,
        patmMmhg: 760,
        paco2Mmhg: 40,
        respiratoryQuotient: 0.6,
      }).ok,
    ).toBe(false));
});
