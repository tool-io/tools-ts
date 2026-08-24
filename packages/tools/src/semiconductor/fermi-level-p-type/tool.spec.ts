import { describe, expect, it } from "vitest";
import {
  calculateFermiLevelPType,
  fermiLevelPTypeExample,
  runFermiLevelPType,
} from "./tool.js";

describe("fermi level p-type calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFermiLevelPType(fermiLevelPTypeExample.input)).toEqual({
      ok: true,
      output: fermiLevelPTypeExample.output,
    });
  });

  it("returns a negative offset for p-type material", () => {
    const offset = calculateFermiLevelPType({
      acceptorConcentrationPerCm3: 1e16,
      niPerCm3: 6.7e9,
    }).fermiLevelOffsetEv;
    expect(offset).toBeLessThan(0);
  });

  it("is the negative of the n-type offset for matching concentrations", () => {
    const at300 = calculateFermiLevelPType({
      acceptorConcentrationPerCm3: 1e16,
      niPerCm3: 1e10,
      temperatureK: 300,
    }).fermiLevelOffsetEv;
    expect(at300).toBeCloseTo(-0.3571585759879732, 14);
  });
});
