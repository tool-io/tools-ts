import { describe, expect, it } from "vitest";
import { faultThrowExample, runFaultThrow } from "./tool.js";

describe("fault-throw", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFaultThrow(faultThrowExample.input)).toEqual({
      ok: true,
      output: faultThrowExample.output,
    });
  });

  it("equals the full dip slip on a vertical fault", () => {
    const result = runFaultThrow({ dipSlipM: 12, faultDipDeg: 90 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.throwM as number).toBe(12);
  });

  it("rejects dips outside the physical range", () => {
    expect(runFaultThrow({ dipSlipM: 10, faultDipDeg: 0 }).ok).toBe(false);
    expect(runFaultThrow({ dipSlipM: 10, faultDipDeg: 95 }).ok).toBe(false);
  });
});
