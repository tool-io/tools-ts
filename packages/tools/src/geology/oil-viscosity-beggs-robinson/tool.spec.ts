import { describe, expect, it } from "vitest";
import {
  oilViscosityBeggsRobinsonExample,
  runOilViscosityBeggsRobinson,
} from "./tool.js";

describe("oil-viscosity-beggs-robinson", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOilViscosityBeggsRobinson(oilViscosityBeggsRobinsonExample.input),
    ).toEqual({
      ok: true,
      output: oilViscosityBeggsRobinsonExample.output,
    });
  });

  it("thins live oil below its dead viscosity", () => {
    const result = runOilViscosityBeggsRobinson({
      oilApiGravity: 30,
      temperatureK: 322.0388888888889,
      solutionGasOilRatioSm3PerSm3: 80,
    });
    if (!result.ok) throw new Error("expected success");
    expect(
      (result.output.oilViscosityPaS as number) <
        (result.output.deadOilViscosityPaS as number),
    ).toBe(true);
  });
  it("rejects non-positive API gravities", () => {
    expect(
      runOilViscosityBeggsRobinson({ oilApiGravity: 0, temperatureK: 320 }).ok,
    ).toBe(false);
  });
});
