import { describe, expect, it } from "vitest";
import { fractionalFlowWaterExample, runFractionalFlowWater } from "./tool.js";

describe("fractional-flow-water", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFractionalFlowWater(fractionalFlowWaterExample.input)).toEqual({
      ok: true,
      output: fractionalFlowWaterExample.output,
    });
  });

  it("returns one when only water flows", () => {
    const result = runFractionalFlowWater({
      waterRelativePermeability: 1,
      oilRelativePermeability: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.waterFractionalFlow as number).toBe(1);
  });

  it("rejects zero relative permeabilities on both phases", () => {
    expect(
      runFractionalFlowWater({
        waterRelativePermeability: 0,
        oilRelativePermeability: 0,
      }).ok,
    ).toBe(false);
  });
});
