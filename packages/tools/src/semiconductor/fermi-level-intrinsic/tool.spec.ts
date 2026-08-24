import { describe, expect, it } from "vitest";
import {
  calculateFermiLevelIntrinsic,
  fermiLevelIntrinsicExample,
  runFermiLevelIntrinsic,
} from "./tool.js";

describe("fermi level intrinsic calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFermiLevelIntrinsic(fermiLevelIntrinsicExample.input)).toEqual({
      ok: true,
      output: fermiLevelIntrinsicExample.output,
    });
  });

  it("sits below midgap when Nc exceeds Nv", () => {
    const ei = calculateFermiLevelIntrinsic({ bandgapEv: 1.12 }).fermiLevelEv;
    expect(ei).toBeLessThan(0.56);
    expect(ei).toBeGreaterThan(0.54);
  });

  it("equals midgap when the effective densities of states match", () => {
    expect(
      calculateFermiLevelIntrinsic({
        bandgapEv: 1.2,
        ncPerCm3: 1e19,
        nvPerCm3: 1e19,
        temperatureK: 500,
      }).fermiLevelEv,
    ).toBe(0.6);
  });

  it("rejects non-positive band gaps through execution", () => {
    expect(runFermiLevelIntrinsic({ bandgapEv: 0 }).ok).toBe(false);
  });
});
