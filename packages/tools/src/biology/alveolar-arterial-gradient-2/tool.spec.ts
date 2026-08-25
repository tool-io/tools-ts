import { describe, expect, it } from "vitest";
import { runAlveolarArterialGradient2 } from "./tool.js";

describe("A-a Gradient Sea Level", () => {
  it("uses room air at sea level by default", () =>
    expect(
      runAlveolarArterialGradient2({ paco2Mmhg: 40, pao2Mmhg: 95 }),
    ).toEqual({
      ok: true,
      output: { aaGradientSeaLevelMmhg: 4.72999999999999 },
    }));
  it("matches an explicit inspired oxygen fraction", () =>
    expect(
      runAlveolarArterialGradient2({
        fiO2Fraction: 0.21,
        paco2Mmhg: 40,
        pao2Mmhg: 95,
      }),
    ).toEqual({
      ok: true,
      output: { aaGradientSeaLevelMmhg: 4.72999999999999 },
    }));
  it("scales alveolar oxygen with pure oxygen ventilation", () =>
    expect(
      runAlveolarArterialGradient2({
        fiO2Fraction: 1,
        paco2Mmhg: 40,
        pao2Mmhg: 95,
      }),
    ).toEqual({ ok: true, output: { aaGradientSeaLevelMmhg: 568 } }));
  it("widens with hypercapnia", () =>
    expect(
      runAlveolarArterialGradient2({
        paco2Mmhg: 30,
        pao2Mmhg: 90,
      }),
    ).toEqual({
      ok: true,
      output: { aaGradientSeaLevelMmhg: 22.22999999999999 },
    }));
  it("rejects non positive arterial CO2", () => {
    const result = runAlveolarArterialGradient2({
      paco2Mmhg: 0,
      pao2Mmhg: 95,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects non positive arterial O2", () => {
    const result = runAlveolarArterialGradient2({
      paco2Mmhg: 40,
      pao2Mmhg: -95,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("pao2Mmhg");
  });
  it("rejects inspired fractions outside the unit interval", () => {
    const result = runAlveolarArterialGradient2({
      fiO2Fraction: 1.2,
      paco2Mmhg: 40,
      pao2Mmhg: 95,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
});
