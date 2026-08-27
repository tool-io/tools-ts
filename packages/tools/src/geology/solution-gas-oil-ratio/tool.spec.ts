import { describe, expect, it } from "vitest";
import { runSolutionGasOilRatio, solutionGasOilRatioExample } from "./tool.js";

describe("solution-gas-oil-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSolutionGasOilRatio(solutionGasOilRatioExample.input)).toEqual({
      ok: true,
      output: solutionGasOilRatioExample.output,
    });
  });

  it("dissolves more gas under higher pressure", () => {
    const shallow = runSolutionGasOilRatio({
      gasGravity: 0.75,
      pressurePa: 6_894_757,
      oilApiGravity: 40,
      temperatureK: 333.15,
    });
    const deep = runSolutionGasOilRatio({
      gasGravity: 0.75,
      pressurePa: 20_684_272,
      oilApiGravity: 40,
      temperatureK: 333.15,
    });
    if (!shallow.ok || !deep.ok) throw new Error("expected success");
    expect(
      (deep.output.solutionGasOilRatioSm3PerSm3 as number) >
        (shallow.output.solutionGasOilRatioSm3PerSm3 as number),
    ).toBe(true);
  });
  it("rejects non-positive pressures", () => {
    expect(
      runSolutionGasOilRatio({
        gasGravity: 0.75,
        pressurePa: -1,
        oilApiGravity: 40,
        temperatureK: 333.15,
      }).ok,
    ).toBe(false);
  });
});
