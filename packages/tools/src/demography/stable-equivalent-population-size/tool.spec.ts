import { describe, expect, it } from "vitest";
import {
  calculateStableEquivalentPopulationSize,
  runStableEquivalentPopulationSize,
  stableEquivalentPopulationSizeExample,
} from "./tool.js";

describe("demography/stable-equivalent-population-size", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStableEquivalentPopulationSize(
        stableEquivalentPopulationSizeExample.input,
      ),
    ).toEqual({
      ok: true,
      output: stableEquivalentPopulationSizeExample.output,
    });
  });

  it("scales linearly with observed births", () => {
    expect(
      calculateStableEquivalentPopulationSize({
        annualBirths: 70000,
        intrinsicBirthRateB: 0.03,
      }),
    ).toEqual({ stableEquivalentSize: 2333333.3333333335 });
  });

  it("rejects a non-positive intrinsic rate", () => {
    expect(
      runStableEquivalentPopulationSize({
        annualBirths: 1000,
        intrinsicBirthRateB: 0,
      }).ok,
    ).toBe(false);
  });
});
