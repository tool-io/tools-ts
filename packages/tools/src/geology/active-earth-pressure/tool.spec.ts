import { describe, expect, it } from "vitest";
import { activeEarthPressureExample, runActiveEarthPressure } from "./tool.js";

describe("active-earth-pressure", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runActiveEarthPressure(activeEarthPressureExample.input)).toEqual({
      ok: true,
      output: activeEarthPressureExample.output,
    });
  });

  it("gives zero pressure at the ground surface", () => {
    const result = runActiveEarthPressure({ depthM: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.activePressureKPa as number).toBe(0);
  });

  it("rejects non-positive unit weights", () => {
    expect(runActiveEarthPressure({ unitWeightKNPerM3: 0 }).ok).toBe(false);
  });
});
