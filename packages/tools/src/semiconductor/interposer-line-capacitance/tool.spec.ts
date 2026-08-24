import { describe, expect, it } from "vitest";
import {
  interposerLineCapacitanceExample,
  runInterposerLineCapacitance,
} from "./tool.js";

describe("Interposer Line Capacitance Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runInterposerLineCapacitance(interposerLineCapacitanceExample.input),
    ).toEqual({
      ok: true,
      output: interposerLineCapacitanceExample.output,
    });
  });

  it("scales linearly with line area and inversely with thickness", () => {
    const base = runInterposerLineCapacitance(
      interposerLineCapacitanceExample.input,
    );
    const scaled = runInterposerLineCapacitance({
      ...interposerLineCapacitanceExample.input,
      dielectricThicknessUm: 2,
      lineLengthUm: 200,
    });
    expect(base.ok && scaled.ok).toBe(true);
    if (base.ok && scaled.ok)
      expect(scaled.output.capacitanceFF).toBe(base.output.capacitanceFF);
  });

  it("accepts vacuum relative permittivity", () => {
    expect(
      runInterposerLineCapacitance({
        dielectricConstant: 1,
        dielectricThicknessUm: 1,
        lineLengthUm: 1,
        lineWidthUm: 1,
      }).ok,
    ).toBe(true);
  });

  it("rejects non-positive geometry and permittivity below one", () => {
    for (const input of [
      { ...interposerLineCapacitanceExample.input, lineWidthUm: 0 },
      { ...interposerLineCapacitanceExample.input, lineLengthUm: -1 },
      { ...interposerLineCapacitanceExample.input, dielectricThicknessUm: 0 },
      { ...interposerLineCapacitanceExample.input, dielectricConstant: 0.9 },
    ])
      expect(runInterposerLineCapacitance(input).ok).toBe(false);
  });
});
