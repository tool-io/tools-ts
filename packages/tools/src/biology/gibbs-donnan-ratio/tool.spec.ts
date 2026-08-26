import { describe, expect, it } from "vitest";
import { gibbsDonnanRatioExample, runGibbsDonnanRatio } from "./tool.js";

describe("Gibbs-Donnan Ratio", () => {
  it("publishes an executable example", () =>
    expect(runGibbsDonnanRatio(gibbsDonnanRatioExample.input)).toEqual({
      ok: true,
      output: gibbsDonnanRatioExample.output,
    }));
  it("drops below one for dilute inside solutions", () =>
    expect(
      runGibbsDonnanRatio({ insideConcM: 0.02, outsideConcM: 0.08 }),
    ).toEqual({ ok: true, output: { gibbsDonnanRatio: 0.25 } }));
  it("is one for equal concentrations", () =>
    expect(
      runGibbsDonnanRatio({ insideConcM: 0.15, outsideConcM: 0.15 }),
    ).toEqual({ ok: true, output: { gibbsDonnanRatio: 1 } }));
  it("accepts fractional millimolar scales", () =>
    expect(
      runGibbsDonnanRatio({ insideConcM: 0.14, outsideConcM: 0.07 }),
    ).toEqual({ ok: true, output: { gibbsDonnanRatio: 2 } }));
  it("rejects zero inside concentration", () => {
    const result = runGibbsDonnanRatio({
      insideConcM: 0,
      outsideConcM: 0.05,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("insideConcM");
  });
  it("rejects negative outside concentration", () =>
    expect(
      runGibbsDonnanRatio({ insideConcM: 0.1, outsideConcM: -0.05 }).ok,
    ).toBe(false));
  it("rejects non-finite concentrations", () =>
    expect(
      runGibbsDonnanRatio({
        insideConcM: Number.POSITIVE_INFINITY,
        outsideConcM: 0.05,
      }).ok,
    ).toBe(false));
});
