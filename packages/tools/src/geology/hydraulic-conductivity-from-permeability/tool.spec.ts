import { describe, expect, it } from "vitest";
import {
  hydraulicConductivityFromPermeabilityExample,
  runHydraulicConductivityFromPermeability,
} from "./tool.js";

describe("hydraulic-conductivity-from-permeability", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHydraulicConductivityFromPermeability(
        hydraulicConductivityFromPermeabilityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: hydraulicConductivityFromPermeabilityExample.output,
    });
  });

  it("doubles conductivity when permeability doubles", () => {
    const result = runHydraulicConductivityFromPermeability({
      intrinsicPermeabilityM2: 2e-11,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.hydraulicConductivityMS as number).toBe(1.96133e-4);
  });

  it("rejects non-positive permeability", () => {
    expect(
      runHydraulicConductivityFromPermeability({ intrinsicPermeabilityM2: 0 })
        .ok,
    ).toBe(false);
  });
});
