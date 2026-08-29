import { describe, expect, it } from "vitest";
import {
  kerrLensSoftAperture,
  kerrLensSoftApertureExample as example,
  runKerrLensSoftAperture,
} from "./tool.js";

describe("Ti:sapphire soft-aperture overlap check", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runKerrLensSoftAperture(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));

  it("does not favor a wider mode-locked mode", () => {
    const result = kerrLensSoftAperture({
      cwModeRadiusUm: 20,
      modeLockedRadiusUm: 30,
      pumpRadiusUm: 25,
    });
    expect(result.softApertureFavorsModeLockedMode).toBe(false);
    expect(result.overlapGainPercent).toBeLessThan(0);
  });

  it("rejects non-positive radii", () =>
    expect(
      runKerrLensSoftAperture({
        cwModeRadiusUm: 0,
        modeLockedRadiusUm: 20,
        pumpRadiusUm: 25,
      }).ok,
    ).toBe(false));
});
