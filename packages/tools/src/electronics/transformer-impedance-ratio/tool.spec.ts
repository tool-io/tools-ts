import { describe, expect, it } from "vitest";
import {
  runTransformerImpedanceRatio,
  transformerImpedanceRatioExample,
} from "./tool.js";

describe("Impedance Ratio", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runTransformerImpedanceRatio(transformerImpedanceRatioExample.input),
    ).toEqual({ ok: true, output: transformerImpedanceRatioExample.output }));

  it("squares a turns ratio of two into four", () =>
    expect(runTransformerImpedanceRatio({ turnsRatio: 2 })).toEqual({
      ok: true,
      output: { impedanceRatio: 4 },
    }));

  it("squares a turns ratio of five into twenty-five", () =>
    expect(runTransformerImpedanceRatio({ turnsRatio: 5 })).toEqual({
      ok: true,
      output: { impedanceRatio: 25 },
    }));

  it("squares fractional ratios below one", () =>
    expect(runTransformerImpedanceRatio({ turnsRatio: 0.5 })).toEqual({
      ok: true,
      output: { impedanceRatio: 0.25 },
    }));

  it("rejects zero turns ratio", () =>
    expect(runTransformerImpedanceRatio({ turnsRatio: 0 })).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "turnsRatio" }] },
      ok: false,
    }));

  it("rejects negative turns ratio", () =>
    expect(runTransformerImpedanceRatio({ turnsRatio: -10 })).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "turnsRatio" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runTransformerImpedanceRatio(undefined as never).ok).toBe(false));
});
