import { describe, expect, it } from "vitest";
import {
  bubblePointPressureVasquezBeggsExample,
  runBubblePointPressureVasquezBeggs,
} from "./tool.js";

describe("bubble-point-pressure-vasquez-beggs", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBubblePointPressureVasquezBeggs(
        bubblePointPressureVasquezBeggsExample.input,
      ),
    ).toEqual({
      ok: true,
      output: bubblePointPressureVasquezBeggsExample.output,
    });
  });

  it("rises with the solution GOR", () => {
    const low = runBubblePointPressureVasquezBeggs({
      solutionGasOilRatioSm3PerSm3: 40,
      gasGravity: 0.8,
      oilApiGravity: 32,
      temperatureK: 344.2611111111111,
    });
    const high = runBubblePointPressureVasquezBeggs({
      solutionGasOilRatioSm3PerSm3: 120,
      gasGravity: 0.8,
      oilApiGravity: 32,
      temperatureK: 344.2611111111111,
    });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(
      (high.output.bubblePointPressurePa as number) >
        (low.output.bubblePointPressurePa as number),
    ).toBe(true);
  });
  it("rejects non-positive gas gravities", () => {
    expect(
      runBubblePointPressureVasquezBeggs({
        solutionGasOilRatioSm3PerSm3: 80,
        gasGravity: 0,
        oilApiGravity: 32,
        temperatureK: 344,
      }).ok,
    ).toBe(false);
  });
});
