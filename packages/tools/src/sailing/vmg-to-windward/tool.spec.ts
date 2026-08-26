import { describe, expect, it } from "vitest";
import { runVmgToWindward, vmgToWindwardExample } from "./tool.js";

describe("vmg to windward calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runVmgToWindward(vmgToWindwardExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.vmgKt).toBeCloseTo(7 * Math.cos(Math.PI / 4), 9);
  });

  it("is zero when beam reaching at ninety degrees", () => {
    const r = runVmgToWindward({ boatSpeedKt: 8, trueWindAngleDeg: 90 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.vmgKt).toBeCloseTo(0, 9);
  });

  it("returns full boat speed when headed directly upwind", () => {
    expect(runVmgToWindward({ boatSpeedKt: 8, trueWindAngleDeg: 0 })).toEqual({
      ok: true,
      output: { vmgKt: 8 },
    });
  });

  it("rejects angles outside the windward hemisphere", () => {
    expect(runVmgToWindward({ boatSpeedKt: 8, trueWindAngleDeg: 91 }).ok).toBe(
      false,
    );
  });
});
