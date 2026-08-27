import { describe, expect, it } from "vitest";
import {
  coaxialInductancePerMeterExample,
  runCoaxialInductancePerMeter,
} from "./tool.js";

const LN2 = Math.LN2;

describe("Coax L Per Meter", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runCoaxialInductancePerMeter(coaxialInductancePerMeterExample.input),
    ).toEqual({ ok: true, output: coaxialInductancePerMeterExample.output }));

  it("returns 200 x ln(2) for a two-to-one diameter ratio", () =>
    expect(
      runCoaxialInductancePerMeter({ diameterInner: 1, diameterOuter: 2 }),
    ).toEqual({
      ok: true,
      output: { inductanceNhPerMeter: 200 * LN2 },
    }));

  it("doubles the inductance when ln of the ratio doubles", () =>
    expect(
      runCoaxialInductancePerMeter({ diameterInner: 1, diameterOuter: 4 }),
    ).toEqual({
      ok: true,
      output: { inductanceNhPerMeter: 277.25887222397813 },
    }));

  it("is independent of the absolute diameter scale", () => {
    const small = runCoaxialInductancePerMeter({
      diameterInner: 0.5,
      diameterOuter: 2.5,
    });
    const large = runCoaxialInductancePerMeter({
      diameterInner: 5,
      diameterOuter: 25,
    });
    if (!small.ok || !large.ok) throw new Error("expected success");
    expect(large.output.inductanceNhPerMeter).toBe(
      small.output.inductanceNhPerMeter,
    );
  });

  it("rejects equal inner and outer diameters", () =>
    expect(
      runCoaxialInductancePerMeter({ diameterInner: 2, diameterOuter: 2 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_dimensions", field: "diameterOuter" }],
      },
      ok: false,
    }));

  it("rejects a non-positive inner diameter", () =>
    expect(
      runCoaxialInductancePerMeter({ diameterInner: -1, diameterOuter: 5 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_dimensions", field: "diameterOuter" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runCoaxialInductancePerMeter(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
