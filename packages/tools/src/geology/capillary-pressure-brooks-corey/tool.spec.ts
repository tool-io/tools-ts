import { describe, expect, it } from "vitest";
import {
  capillaryPressureBrooksCoreyExample,
  runCapillaryPressureBrooksCorey,
} from "./tool.js";

describe("capillary-pressure-brooks-corey", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapillaryPressureBrooksCorey(
        capillaryPressureBrooksCoreyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: capillaryPressureBrooksCoreyExample.output,
    });
  });

  it("returns the entry pressure at full effective saturation", () => {
    const result = runCapillaryPressureBrooksCorey({
      wettingPhaseSaturation: 1,
      entryPressurePa: 500,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.capillaryPressurePa as number).toBeCloseTo(500, 12);
  });

  it("rejects saturations at or below the residual", () => {
    expect(
      runCapillaryPressureBrooksCorey({
        wettingPhaseSaturation: 0.2,
        entryPressurePa: 500,
        residualWettingSaturation: 0.2,
      }).ok,
    ).toBe(false);
  });
});
