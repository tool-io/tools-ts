import { describe, expect, it } from "vitest";
import {
  lowKInterconnectCapacitanceExample,
  runLowKInterconnectCapacitance,
} from "./tool.js";

describe("Low-K Line Capacitance Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLowKInterconnectCapacitance(lowKInterconnectCapacitanceExample.input),
    ).toEqual({ ok: true, output: lowKInterconnectCapacitanceExample.output });
  });

  it("scales linearly with area and inversely with thickness", () => {
    const base = runLowKInterconnectCapacitance(
      lowKInterconnectCapacitanceExample.input,
    );
    const scaled = runLowKInterconnectCapacitance({
      ...lowKInterconnectCapacitanceExample.input,
      dielectricThicknessUm: 1,
      lineAreaUm2: 2,
    });
    expect(base.ok && scaled.ok).toBe(true);
    if (base.ok && scaled.ok)
      expect(scaled.output.capacitanceFF).toBe(base.output.capacitanceFF);
  });

  it("requires relative permittivity above vacuum and positive geometry", () => {
    for (const input of [
      { ...lowKInterconnectCapacitanceExample.input, lowKPermittivity: 1 },
      { ...lowKInterconnectCapacitanceExample.input, lineAreaUm2: 0 },
      { ...lowKInterconnectCapacitanceExample.input, dielectricThicknessUm: 0 },
    ])
      expect(runLowKInterconnectCapacitance(input).ok).toBe(false);
  });
});
