import { describe, expect, it } from "vitest";
import { subthresholdSlopeExample, runSubthresholdSlope } from "./tool.js";

describe("mosfet subthreshold slope calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const result = runSubthresholdSlope(subthresholdSlopeExample.input);
    if (!result.ok) throw new Error("expected success");
    // Ideal slope is ~60 mV/decade at room temperature.
    expect(result.output.slopeMVPerDecade).toBeCloseTo(77.6, 0);
  });

  it("rejects negative temperatures through execution", () => {
    expect(
      runSubthresholdSlope({
        depletionCapacitanceRatio: 0.3,
        temperatureK: -1,
      }),
    ).toMatchObject({ error: {}, ok: false });
  });
});
