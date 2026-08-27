import { describe, expect, it } from "vitest";
import { faultHeaveExample, runFaultHeave } from "./tool.js";

describe("fault-heave", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFaultHeave(faultHeaveExample.input)).toEqual({
      ok: true,
      output: faultHeaveExample.output,
    });
  });

  it("gives zero heave on a vertical fault", () => {
    const result = runFaultHeave({ dipSlipM: 30, faultDipDeg: 90 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.heaveM as number).toBeCloseTo(0, 12);
  });

  it("rejects negative dip slip", () => {
    expect(runFaultHeave({ dipSlipM: -1, faultDipDeg: 60 }).ok).toBe(false);
  });
});
