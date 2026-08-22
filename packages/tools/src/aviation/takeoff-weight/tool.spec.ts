import { describe, expect, it } from "vitest";
import { takeoffWeightExample, runTakeoffWeight } from "./tool.js";

describe("takeoff weight calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runTakeoffWeight(takeoffWeightExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output).toEqual(takeoffWeightExample.output);
  });

  it("uses ZFW when provided instead of payload", () => {
    const r = runTakeoffWeight({
      fuelWeightLb: 360,
      payloadLb: 999,
      zeroFuelWeightLb: 2000,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.takeoffWeightLb).toBe(2360);
  });
});
