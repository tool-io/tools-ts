import { describe, expect, it } from "vitest";
import { hciSubstrateCurrentExample, runHciSubstrateCurrent } from "./tool.js";

describe("HCI Substrate Current Calculator", () => {
  it("reproduces its canonical example exactly with defaults", () =>
    expect(runHciSubstrateCurrent(hciSubstrateCurrentExample.input)).toEqual({
      ok: true,
      output: { substrateCurrentNanoA: 0.0036787944117144234 },
    }));

  it("weakens exponentially as bias overshoot shrinks", () =>
    expect(
      runHciSubstrateCurrent({
        drainCurrentMilliamps: 1,
        drainVolts: 2,
        saturationVolts: 1,
      }),
    ).toEqual({
      ok: true,
      output: { substrateCurrentNanoA: 0.0022313016014842983 },
    }));

  it("accepts explicit coefficient and characteristic voltage", () =>
    expect(
      runHciSubstrateCurrent({
        characteristicVolts: 1,
        coefficientNanoAmpsPerMilliamp: 0.02,
        drainCurrentMilliamps: 1,
        drainVolts: 3,
        saturationVolts: 2.5,
      }),
    ).toEqual({
      ok: true,
      output: { substrateCurrentNanoA: 0.0027067056647322543 },
    }));

  it("yields zero substrate current for zero drain current", () =>
    expect(
      runHciSubstrateCurrent({
        drainCurrentMilliamps: 0,
        drainVolts: 3,
        saturationVolts: 1.5,
      }),
    ).toEqual({ ok: true, output: { substrateCurrentNanoA: 0 } }));

  it("accepts zero drain current at the schema minimum", () =>
    expect(
      runHciSubstrateCurrent({
        drainCurrentMilliamps: 0,
        drainVolts: 1.8,
        saturationVolts: 1.8 - 0.0001,
      }),
    ).toEqual({ ok: true, output: { substrateCurrentNanoA: 0 } }));

  it("rejects drain voltage equal to saturation voltage", () =>
    expect(
      runHciSubstrateCurrent({
        drainCurrentMilliamps: 1,
        drainVolts: 1.5,
        saturationVolts: 1.5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "insufficient_drain_bias", field: "drainVolts" }],
      },
      ok: false,
    }));

  it("rejects drain voltage below saturation voltage", () =>
    expect(
      runHciSubstrateCurrent({
        drainCurrentMilliamps: 1,
        drainVolts: 1,
        saturationVolts: 1.5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "insufficient_drain_bias", field: "drainVolts" }],
      },
      ok: false,
    }));

  it("rejects negative drain current below the schema minimum", () =>
    expect(
      runHciSubstrateCurrent({
        drainCurrentMilliamps: -1,
        drainVolts: 3,
        saturationVolts: 1.5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "drainCurrentMilliamps" }],
      },
      ok: false,
    }));

  it("rejects non-finite voltages", () =>
    expect(
      runHciSubstrateCurrent({
        drainCurrentMilliamps: 1,
        drainVolts: Number.NaN,
        saturationVolts: 1.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "drainVolts" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runHciSubstrateCurrent({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "drainCurrentMilliamps" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runHciSubstrateCurrent({
        drainCurrentMilliamps: 1,
        drainVolts: 3,
        extra: 2,
        saturationVolts: 1.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
