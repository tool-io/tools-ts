import { describe, expect, it } from "vitest";
import {
  alveolarArterialGradientExample,
  runAlveolarArterialGradient,
} from "./tool.js";

describe("A-a Gradient", () => {
  it("publishes an executable example", () =>
    expect(
      runAlveolarArterialGradient(alveolarArterialGradientExample.input),
    ).toEqual({ ok: true, output: alveolarArterialGradientExample.output }));
  it("computes room air at sea level", () =>
    expect(
      runAlveolarArterialGradient({
        fiO2Fraction: 0.21,
        paco2Mmhg: 40,
        patmMmhg: 760,
        pao2Mmhg: 90,
      }),
    ).toEqual({ ok: true, output: { aaGradientMmhg: 9.72999999999999 } }));
  it("computes a large gradient on supplemental oxygen", () =>
    expect(
      runAlveolarArterialGradient({
        fiO2Fraction: 1,
        paco2Mmhg: 40,
        patmMmhg: 760,
        pao2Mmhg: 300,
      }),
    ).toEqual({ ok: true, output: { aaGradientMmhg: 363 } }));
  it("accepts the zero FiO2 bound", () =>
    expect(
      runAlveolarArterialGradient({
        fiO2Fraction: 0,
        paco2Mmhg: 40,
        patmMmhg: 760,
        pao2Mmhg: 100,
      }),
    ).toEqual({ ok: true, output: { aaGradientMmhg: -150 } }));
  it("rejects negative gradients as plain numbers", () => {
    const result = runAlveolarArterialGradient({
      fiO2Fraction: 0.21,
      paco2Mmhg: 40,
      patmMmhg: 760,
      pao2Mmhg: 200,
    });
    expect(result.ok).toBe(true);
  });
  it("rejects non-positive atmospheric pressure", () => {
    const result = runAlveolarArterialGradient({
      fiO2Fraction: 0.21,
      paco2Mmhg: 40,
      patmMmhg: 0,
      pao2Mmhg: 95,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("patmMmhg");
  });
  it("rejects non-positive arterial CO2", () => {
    const result = runAlveolarArterialGradient({
      fiO2Fraction: 0.21,
      paco2Mmhg: -40,
      patmMmhg: 760,
      pao2Mmhg: 95,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects non-positive arterial O2", () => {
    const result = runAlveolarArterialGradient({
      fiO2Fraction: 0.21,
      paco2Mmhg: 40,
      patmMmhg: 760,
      pao2Mmhg: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("pao2Mmhg");
  });
});
