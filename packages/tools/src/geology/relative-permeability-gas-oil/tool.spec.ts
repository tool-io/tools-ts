import { describe, expect, it } from "vitest";
import {
  relativePermeabilityGasOilExample,
  runRelativePermeabilityGasOil,
} from "./tool.js";

describe("relative-permeability-gas-oil", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRelativePermeabilityGasOil(relativePermeabilityGasOilExample.input),
    ).toEqual({
      ok: true,
      output: relativePermeabilityGasOilExample.output,
    });
  });

  it("returns zero gas permeability at critical gas saturation", () => {
    const result = runRelativePermeabilityGasOil({
      gasSaturation: 0.05,
      residualGasSaturation: 0.05,
      residualOilSaturation: 0.2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.gasRelativePermeability as number).toBe(0);
    expect(result.output.oilRelativePermeability as number).toBe(1);
  });

  it("rejects negative residual saturations", () => {
    expect(
      runRelativePermeabilityGasOil({
        gasSaturation: 0.4,
        residualGasSaturation: -0.1,
      }).ok,
    ).toBe(false);
  });
});
