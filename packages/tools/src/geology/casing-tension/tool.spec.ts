import { describe, expect, it } from "vitest";
import { casingTensionExample, runCasingTension } from "./tool.js";

describe("geology/casing-tension", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCasingTension(casingTensionExample.input)).toEqual({
      ok: true,
      output: casingTensionExample.output,
    });
  });

  it("equals the air weight without buoyancy", () => {
    const result = runCasingTension({
      casingLinearWeightNewtonsPerMetre: 792,
      suspendedLengthMetres: 3000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.effectiveTensionKilonewtons as number).toBe(
      result.output.airWeightKilonewtons as number,
    );
    expect(result.output.buoyancyFactor as number).toBe(1);
  });

  it("rejects mud heavier than steel", () => {
    expect(
      runCasingTension({
        casingLinearWeightNewtonsPerMetre: 792,
        suspendedLengthMetres: 3000,
        mudDensityKilogramsPerCubicMetre: 9000,
      }).ok,
    ).toBe(false);
    expect(
      runCasingTension({
        casingLinearWeightNewtonsPerMetre: 0,
        suspendedLengthMetres: 3000,
      }).ok,
    ).toBe(false);
  });
});
