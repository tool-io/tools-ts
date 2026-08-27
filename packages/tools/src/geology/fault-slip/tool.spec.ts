import { describe, expect, it } from "vitest";
import { faultSlipExample, runFaultSlip } from "./tool.js";

describe("fault-slip", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFaultSlip(faultSlipExample.input)).toEqual({
      ok: true,
      output: faultSlipExample.output,
    });
  });

  it("computes a 45 degree slip vector", () => {
    const result = runFaultSlip({ heaveMeters: 1, throwMeters: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.netSlipMeters as number).toBe(Math.SQRT2);
  });
  it("rejects non-positive components", () => {
    expect(runFaultSlip({ heaveMeters: 0, throwMeters: 1 }).ok).toBe(false);
  });
});
