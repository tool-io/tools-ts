import { describe, expect, it } from "vitest";
import {
  crystalFractionationExample,
  runCrystalFractionation,
} from "./tool.js";

describe("crystal-fractionation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCrystalFractionation(crystalFractionationExample.input)).toEqual({
      ok: true,
      output: crystalFractionationExample.output,
    });
  });

  it("returns the initial concentration for incompatible behavior at F of one", () => {
    const result = runCrystalFractionation({
      bulkPartitionCoefficient: 0.01,
      fractionLiquidRemaining: 1,
      initialConcentrationPpm: 42,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.residualConcentrationPpm).toBe(42);
  });
  it("rejects a fully crystallized liquid", () => {
    expect(
      runCrystalFractionation({
        bulkPartitionCoefficient: 2,
        fractionLiquidRemaining: 0,
        initialConcentrationPpm: 50,
      }).ok,
    ).toBe(false);
  });
});
