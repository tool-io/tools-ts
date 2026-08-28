import { describe, expect, it } from "vitest";
import { calculateQFactor, qFactorExample, runQFactor } from "./tool.js";

describe("q factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runQFactor(qFactorExample.input)).toEqual({
      ok: true,
      output: qFactorExample.output,
    });
  });

  it("rises as series losses shrink and equals omega0*L/R at resonance", () => {
    const lossy = calculateQFactor({
      capacitanceF: 1e-6,
      inductanceH: 0.01,
      resistanceOhms: 20,
    }).qualityFactor;
    expect(qFactorExample.output.qualityFactor).toBeGreaterThan(lossy);
    // At resonance omega0 * L = sqrt(L/C), so both conventions agree.
    const omega0 =
      1 /
      Math.sqrt(
        qFactorExample.input.inductanceH * qFactorExample.input.capacitanceF,
      );
    expect(
      (omega0 * qFactorExample.input.inductanceH) /
        qFactorExample.input.resistanceOhms,
    ).toBeCloseTo(qFactorExample.output.qualityFactor, 9);
  });

  it("rejects invalid inputs through execution", () => {
    for (const bad of [
      { capacitanceF: 0, inductanceH: 0.01, resistanceOhms: 10 },
      { capacitanceF: 1e-6, inductanceH: 0.01, resistanceOhms: 0 },
    ])
      expect(runQFactor(bad).ok).toBe(false);
  });
});
