import { describe, expect, it } from "vitest";
import {
  calculateCapacitiveReactance,
  capacitiveReactanceExample,
  runCapacitiveReactance,
} from "./tool.js";

describe("capacitive reactance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCapacitiveReactance(capacitiveReactanceExample.input)).toEqual({
      ok: true,
      output: capacitiveReactanceExample.output,
    });
  });

  it("halves reactance when frequency doubles", () => {
    const base = calculateCapacitiveReactance({
      capacitanceF: 1e-6,
      frequencyHz: 100,
    }).reactanceOhms;
    const doubled = calculateCapacitiveReactance({
      capacitanceF: 1e-6,
      frequencyHz: 200,
    }).reactanceOhms;
    expect(doubled).toBeCloseTo(base / 2, 12);
  });

  it("rejects non-positive frequency or capacitance through execution", () => {
    for (const bad of [
      { capacitanceF: 0, frequencyHz: 1000 },
      { capacitanceF: 1e-6, frequencyHz: -1000 },
    ])
      expect(runCapacitiveReactance(bad).ok).toBe(false);
  });
});
