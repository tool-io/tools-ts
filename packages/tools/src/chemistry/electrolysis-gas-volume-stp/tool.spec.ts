import { describe, expect, it } from "vitest";
import { runElectrolysisGasVolumeStp } from "./tool.js";
describe("Electrolysis Gas Volume STP", () => {
  it("calculates a valid result", () =>
    expect(runElectrolysisGasVolumeStp({ molesGas: 2 })).toEqual({
      ok: true,
      output: { gasVolumeLiters: 44.828 },
    }));
  it("returns zero volume for zero moles", () =>
    expect(runElectrolysisGasVolumeStp({ molesGas: 0 })).toEqual({
      ok: true,
      output: { gasVolumeLiters: 0 },
    }));
});
