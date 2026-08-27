import { describe, expect, it } from "vitest";
import {
  calculateCoreLossSteinmetz,
  runCoreLossSteinmetz,
  coreLossSteinmetzExample,
} from "./tool.js";

describe("Steinmetz Core Loss", () => {
  it("reproduces its canonical example with all defaults", () => {
    expect(runCoreLossSteinmetz(coreLossSteinmetzExample.input)).toEqual({
      ok: true,
      output: coreLossSteinmetzExample.output,
    });
  });

  it("matches the Steinmetz formula with explicit exponents", () => {
    expect(
      calculateCoreLossSteinmetz({
        alphaExp: 1.7,
        betaExp: 2,
        fluxDensityMt: 150,
        frequencyKhz: 500,
        kSteinmetz: 0.004,
      }).coreLossMwPerCm3,
    ).toBe(0.004 * Math.pow(500, 1.7) * Math.pow(0.15, 2));
  });

  it("returns zero loss for zero flux density", () => {
    expect(
      calculateCoreLossSteinmetz({ fluxDensityMt: 0, frequencyKhz: 100 })
        .coreLossMwPerCm3,
    ).toBe(0);
  });

  it("grows superlinearly with frequency at the default exponent", () => {
    expect(
      calculateCoreLossSteinmetz({
        ...coreLossSteinmetzExample.input,
        frequencyKhz: 200,
      }).coreLossMwPerCm3,
    ).toBeCloseTo(2 ** 1.5 * 0.028991186547107816, 12);
  });

  it("scales with the beta power of the tesla flux density", () => {
    expect(
      calculateCoreLossSteinmetz({
        ...coreLossSteinmetzExample.input,
        fluxDensityMt: 400,
      }).coreLossMwPerCm3,
    ).toBeCloseTo(2 ** 2.2 * 0.028991186547107816, 12);
  });

  it("rejects non-positive coefficient or exponents", () => {
    expect(
      runCoreLossSteinmetz({ ...coreLossSteinmetzExample.input, kSteinmetz: 0 })
        .ok,
    ).toBe(false);
    expect(
      runCoreLossSteinmetz({ ...coreLossSteinmetzExample.input, alphaExp: -1 })
        .ok,
    ).toBe(false);
    expect(
      runCoreLossSteinmetz({ ...coreLossSteinmetzExample.input, betaExp: 0 })
        .ok,
    ).toBe(false);
  });

  it("rejects non-positive frequency or negative flux density", () => {
    expect(
      runCoreLossSteinmetz({
        ...coreLossSteinmetzExample.input,
        frequencyKhz: 0,
      }).ok,
    ).toBe(false);
    expect(
      runCoreLossSteinmetz({
        ...coreLossSteinmetzExample.input,
        fluxDensityMt: -10,
      }).ok,
    ).toBe(false);
  });
});
