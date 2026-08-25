import { describe, expect, it } from "vitest";
import {
  calculateTarePayloadNetGrossSplit,
  tarePayloadNetGrossSplitExample,
  runTarePayloadNetGrossSplit,
} from "./tool.js";

describe("tare-payload-net-gross-split", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTarePayloadNetGrossSplit(tarePayloadNetGrossSplitExample.input),
    ).toEqual({
      ok: true,
      output: tarePayloadNetGrossSplitExample.output,
    });
  });

  it("splits a zero-tare weighbridge reading into pure payload", () => {
    const result = runTarePayloadNetGrossSplit({
      grossMassKg: 500,
      tareMassKg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.payloadNetMassKg as number).toBe(500);
    expect(result.output.tareSharePercent as number).toBe(0);
  });
  it("rejects tare greater than or equal to gross", () => {
    expect(
      runTarePayloadNetGrossSplit({ grossMassKg: 100, tareMassKg: 100 }).ok,
    ).toBe(false);
  });

  it("rejects non-finite mass in the direct API", () => {
    expect(() =>
      calculateTarePayloadNetGrossSplit({
        grossMassKg: Number.POSITIVE_INFINITY,
        tareMassKg: 10,
      }),
    ).toThrow("must be finite");
  });
});
