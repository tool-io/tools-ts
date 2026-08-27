import { describe, expect, it } from "vitest";
import {
  calculateCrystalLoadCapacitance,
  crystalLoadCapacitanceExample,
  runCrystalLoadCapacitance,
} from "./tool.js";

describe("Crystal Load Caps Parallel", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCrystalLoadCapacitance(crystalLoadCapacitanceExample.input),
    ).toEqual({
      ok: true,
      output: crystalLoadCapacitanceExample.output,
    });
  });

  it("applies the two-times rule to the difference", () => {
    expect(
      calculateCrystalLoadCapacitance({ clPf: 18, strayPf: 5 })
        .externalCapacitorEachPf,
    ).toBe(26);
  });

  it("requires no external capacitors when stray matches the load spec", () => {
    expect(runCrystalLoadCapacitance({ clPf: 4, strayPf: 4 })).toEqual({
      ok: true,
      output: { externalCapacitorEachPf: 0 },
    });
  });

  it("doubles the per-pin value as the specified load margin grows", () => {
    const base = calculateCrystalLoadCapacitance({
      clPf: 12,
      strayPf: 4,
    }).externalCapacitorEachPf;
    expect(base).toBe(16);
    expect(
      calculateCrystalLoadCapacitance({ clPf: 20, strayPf: 4 })
        .externalCapacitorEachPf,
    ).toBe(base * 2);
  });

  it("rejects stray capacitance above the load spec via negative_capacitance", () => {
    expect(runCrystalLoadCapacitance({ clPf: 6, strayPf: 9 })).toMatchObject({
      error: {
        issues: [{ code: "negative_capacitance", field: "strayPf" }],
      },
      ok: false,
    });
  });

  it("rejects non-positive load capacitance with a stable code", () => {
    expect(runCrystalLoadCapacitance({ clPf: 0, strayPf: 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_capacitance", field: "clPf" }] },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runCrystalLoadCapacitance({
        ...crystalLoadCapacitanceExample.input,
        cParasitic: 1,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "cParasitic" }] },
      ok: false,
    });
  });
});
