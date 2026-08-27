import { describe, expect, it } from "vitest";
import { degreeOfSaturationExample, runDegreeOfSaturation } from "./tool.js";

describe("degree-of-saturation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDegreeOfSaturation(degreeOfSaturationExample.input)).toEqual({
      ok: true,
      output: degreeOfSaturationExample.output,
    });
  });

  it("returns one hundred percent when fully saturated", () => {
    const result = runDegreeOfSaturation({
      voidVolumeM3: 0.4,
      waterVolumeM3: 0.4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.degreeOfSaturationPercent as number).toBe(100);
  });
  it("rejects water volumes exceeding void volume", () => {
    expect(
      runDegreeOfSaturation({ voidVolumeM3: 0.4, waterVolumeM3: 0.5 }).ok,
    ).toBe(false);
  });
});
