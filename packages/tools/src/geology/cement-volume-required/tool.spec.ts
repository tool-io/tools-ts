import { describe, expect, it } from "vitest";
import {
  cementVolumeRequiredExample,
  runCementVolumeRequired,
} from "./tool.js";

describe("geology/cement-volume-required", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCementVolumeRequired(cementVolumeRequiredExample.input)).toEqual({
      ok: true,
      output: cementVolumeRequiredExample.output,
    });
  });

  it("matches the theoretical volume without excess", () => {
    const result = runCementVolumeRequired({
      holeDiameterMetres: 0.31115,
      casingOuterDiameterMetres: 0.1778,
      openHoleLengthMetres: 1500,
      excessPercent: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.cementSlurryVolumeCubicMetres as number).toBe(
      result.output.theoreticalAnnularVolumeCubicMetres as number,
    );
  });

  it("rejects casing larger than the hole and negative excess", () => {
    expect(
      runCementVolumeRequired({
        holeDiameterMetres: 0.1778,
        casingOuterDiameterMetres: 0.31115,
        openHoleLengthMetres: 1500,
      }).ok,
    ).toBe(false);
    expect(
      runCementVolumeRequired({
        holeDiameterMetres: 0.31115,
        casingOuterDiameterMetres: 0.1778,
        openHoleLengthMetres: 1500,
        excessPercent: -10,
      }).ok,
    ).toBe(false);
  });
});
