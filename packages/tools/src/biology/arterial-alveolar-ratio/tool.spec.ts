import { describe, expect, it } from "vitest";
import {
  arterialAlveolarRatioExample,
  runArterialAlveolarRatio,
} from "./tool.js";

describe("a/A Ratio", () => {
  it("publishes an executable example", () =>
    expect(
      runArterialAlveolarRatio(arterialAlveolarRatioExample.input),
    ).toEqual({ ok: true, output: arterialAlveolarRatioExample.output }));
  it("computes room air ratio", () =>
    expect(
      runArterialAlveolarRatio({
        fiO2Fraction: 0.21,
        pacO2Mmhg: 40,
        paO2Mmhg: 90,
        patmMmhg: 760,
      }),
    ).toEqual({
      ok: true,
      output: { arterialAlveolarRatio: 0.9024365787626593 },
    }));
  it("rises toward one as gas exchange worsens", () => {
    const healthy = runArterialAlveolarRatio({
      fiO2Fraction: 0.4,
      pacO2Mmhg: 40,
      paO2Mmhg: 100,
      patmMmhg: 760,
    });
    const injured = runArterialAlveolarRatio({
      fiO2Fraction: 0.4,
      pacO2Mmhg: 40,
      paO2Mmhg: 200,
      patmMmhg: 760,
    });
    expect(healthy.ok).toBe(true);
    expect(injured.ok).toBe(true);
    if (healthy.ok && injured.ok)
      expect(injured.output.arterialAlveolarRatio).toBeGreaterThan(
        Number(healthy.output.arterialAlveolarRatio),
      );
  });
  it("rejects an alveolar tension that is not positive", () => {
    const result = runArterialAlveolarRatio({
      fiO2Fraction: 0.1,
      pacO2Mmhg: 80,
      paO2Mmhg: 50,
      patmMmhg: 760,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_alveolar");
  });
  it("rejects zero atmospheric pressure", () =>
    expect(
      runArterialAlveolarRatio({
        fiO2Fraction: 0.21,
        pacO2Mmhg: 40,
        paO2Mmhg: 90,
        patmMmhg: 0,
      }).ok,
    ).toBe(false));
  it("rejects zero arterial CO2", () =>
    expect(
      runArterialAlveolarRatio({
        fiO2Fraction: 0.21,
        pacO2Mmhg: 0,
        paO2Mmhg: 90,
        patmMmhg: 760,
      }).ok,
    ).toBe(false));
  it("rejects zero arterial O2", () =>
    expect(
      runArterialAlveolarRatio({
        fiO2Fraction: 0.21,
        pacO2Mmhg: 40,
        paO2Mmhg: 0,
        patmMmhg: 760,
      }).ok,
    ).toBe(false));
  it("rejects an inspired fraction above one", () =>
    expect(
      runArterialAlveolarRatio({
        fiO2Fraction: 1.5,
        pacO2Mmhg: 40,
        paO2Mmhg: 90,
        patmMmhg: 760,
      }).ok,
    ).toBe(false));
});
