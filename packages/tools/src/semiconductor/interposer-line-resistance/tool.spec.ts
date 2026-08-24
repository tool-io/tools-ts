import { describe, expect, it } from "vitest";
import {
  interposerLineResistanceExample,
  runInterposerLineResistance,
} from "./tool.js";

describe("Interposer Line Resistance Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runInterposerLineResistance(interposerLineResistanceExample.input),
    ).toEqual({
      ok: true,
      output: { resistanceMilliohms: 8400.000000000002 },
    }));

  it("treats a square line as a fixed sheet contribution", () =>
    expect(
      runInterposerLineResistance({
        lengthUm: 10,
        lineWidthUm: 10,
        metalThicknessUm: 10,
      }),
    ).toEqual({
      ok: true,
      output: { resistanceMilliohms: 1.6800000000000002 },
    }));

  it("doubles the resistance when thickness halves", () =>
    expect(
      runInterposerLineResistance({
        lengthUm: 1000,
        lineWidthUm: 2,
        metalThicknessUm: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { resistanceMilliohms: 16800.000000000004 },
    }));

  it("scales with narrower lines", () =>
    expect(
      runInterposerLineResistance({
        lengthUm: 500,
        lineWidthUm: 0.5,
        metalThicknessUm: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { resistanceMilliohms: 33600.00000000001 },
    }));

  it("rejects zero length with a stable code", () =>
    expect(
      runInterposerLineResistance({
        lengthUm: 0,
        lineWidthUm: 2,
        metalThicknessUm: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lengthUm" }] },
      ok: false,
    }));

  it("rejects zero width with a stable code", () =>
    expect(
      runInterposerLineResistance({
        lengthUm: 1000,
        lineWidthUm: 0,
        metalThicknessUm: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lineWidthUm" }] },
      ok: false,
    }));

  it("rejects negative thickness with a stable code", () =>
    expect(
      runInterposerLineResistance({
        lengthUm: 1000,
        lineWidthUm: 2,
        metalThicknessUm: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "metalThicknessUm" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runInterposerLineResistance({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lengthUm" }] },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(runInterposerLineResistance({ extra: 1 })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
