import { describe, expect, it } from "vitest";
import { payloadAvailableExample, runPayloadAvailable } from "./tool.js";

describe("payload available calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPayloadAvailable(payloadAvailableExample.input)).toEqual({
      ok: true,
      output: { payloadAvailableLb: 560 },
    });
  });
  it("reports negative when overweight", () => {
    const r = runPayloadAvailable({
      basicEmptyWeightLb: 2000,
      fuelWeightLb: 500,
      maxTakeoffWeightLb: 2300,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.payloadAvailableLb).toBe(-200);
  });
});
