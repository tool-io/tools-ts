import { describe, expect, it } from "vitest";
import {
  passiveEarthPressureExample,
  runPassiveEarthPressure,
} from "./tool.js";

describe("passive-earth-pressure", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPassiveEarthPressure(passiveEarthPressureExample.input)).toEqual({
      ok: true,
      output: passiveEarthPressureExample.output,
    });
  });

  it("gives zero pressure at the ground surface", () => {
    const result = runPassiveEarthPressure({ depthM: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.passivePressureKPa as number).toBe(0);
  });

  it("rejects negative depths", () => {
    expect(runPassiveEarthPressure({ depthM: -1 }).ok).toBe(false);
  });
});
