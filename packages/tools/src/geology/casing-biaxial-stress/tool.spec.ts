import { describe, expect, it } from "vitest";
import { casingBiaxialStressExample, runCasingBiaxialStress } from "./tool.js";

describe("geology/casing-biaxial-stress", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCasingBiaxialStress(casingBiaxialStressExample.input)).toEqual({
      ok: true,
      output: casingBiaxialStressExample.output,
    });
  });

  it("keeps the nominal collapse rating with zero tension", () => {
    const result = runCasingBiaxialStress({
      nominalCollapsePressureMegapascals: 40,
      yieldStrengthMegapascals: 551.6,
      axialTensileLoadKilonewtons: 0,
      crossSectionalAreaSquareMillimetres: 9714,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.deratedCollapsePressureMegapascals as number).toBe(40);
  });

  it("rejects axial stress beyond yield and non-positive area", () => {
    expect(
      runCasingBiaxialStress({
        nominalCollapsePressureMegapascals: 40,
        yieldStrengthMegapascals: 551.6,
        axialTensileLoadKilonewtons: 60000,
        crossSectionalAreaSquareMillimetres: 9714,
      }).ok,
    ).toBe(false);
    expect(
      runCasingBiaxialStress({
        nominalCollapsePressureMegapascals: 40,
        yieldStrengthMegapascals: 551.6,
        axialTensileLoadKilonewtons: 1800,
        crossSectionalAreaSquareMillimetres: 0,
      }).ok,
    ).toBe(false);
  });
});
