import { describe, expect, it } from "vitest";
import {
  rockPorosityCalculatorExample,
  runRockPorosityCalculator,
} from "./tool.js";

describe("rock-porosity-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRockPorosityCalculator(rockPorosityCalculatorExample.input),
    ).toEqual({
      ok: true,
      output: rockPorosityCalculatorExample.output,
    });
  });

  it("returns zero porosity for a pore-free sample", () => {
    const result = runRockPorosityCalculator({
      bulkVolumeM3: 2,
      poreVolumeM3: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.porosityFraction as number).toBe(0);
  });
  it("rejects pore volumes larger than the bulk volume", () => {
    expect(
      runRockPorosityCalculator({ bulkVolumeM3: 1, poreVolumeM3: 2 }).ok,
    ).toBe(false);
  });
});
