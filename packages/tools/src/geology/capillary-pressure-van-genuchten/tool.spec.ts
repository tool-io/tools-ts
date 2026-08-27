import { describe, expect, it } from "vitest";
import {
  capillaryPressureVanGenuchtenExample,
  runCapillaryPressureVanGenuchten,
} from "./tool.js";

describe("capillary-pressure-van-genuchten", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapillaryPressureVanGenuchten(
        capillaryPressureVanGenuchtenExample.input,
      ),
    ).toEqual({
      ok: true,
      output: capillaryPressureVanGenuchtenExample.output,
    });
  });

  it("returns zero pressure at full effective saturation", () => {
    const result = runCapillaryPressureVanGenuchten({
      effectiveSaturation: 1,
      alphaPerPascal: 5e-5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.capillaryPressurePa as number).toBe(0);
  });

  it("rejects pore size indices of one or less", () => {
    expect(
      runCapillaryPressureVanGenuchten({
        effectiveSaturation: 0.5,
        alphaPerPascal: 5e-5,
        poreSizeIndex: 1,
      }).ok,
    ).toBe(false);
  });
});
