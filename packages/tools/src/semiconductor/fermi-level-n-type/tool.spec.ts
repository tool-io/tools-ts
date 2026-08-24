import { describe, expect, it } from "vitest";
import {
  calculateFermiLevelNType,
  fermiLevelNTypeExample,
  runFermiLevelNType,
} from "./tool.js";

describe("fermi level n-type calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFermiLevelNType(fermiLevelNTypeExample.input)).toEqual({
      ok: true,
      output: fermiLevelNTypeExample.output,
    });
  });

  it("returns zero when doping equals the intrinsic concentration", () => {
    expect(
      calculateFermiLevelNType({
        donorConcentrationPerCm3: 6.7e9,
        niPerCm3: 6.7e9,
      }).fermiLevelOffsetEv,
    ).toBeCloseTo(0, 9);
  });

  it("scales linearly with absolute temperature", () => {
    const input = { donorConcentrationPerCm3: 1e16, niPerCm3: 1e10 };
    const at300 = calculateFermiLevelNType({ ...input, temperatureK: 300 });
    const at600 = calculateFermiLevelNType({ ...input, temperatureK: 600 });
    expect(at600.fermiLevelOffsetEv).toBeCloseTo(
      2 * at300.fermiLevelOffsetEv,
      14,
    );
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { donorConcentrationPerCm3: 0, niPerCm3: 1e10 },
      { donorConcentrationPerCm3: 1e16, niPerCm3: -1 },
    ])
      expect(runFermiLevelNType(bad).ok).toBe(false);
  });
});
