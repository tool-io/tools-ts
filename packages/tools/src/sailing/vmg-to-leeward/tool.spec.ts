import { describe, expect, it } from "vitest";
import { runVmgToLeeward, vmgToLeewardExample } from "./tool.js";

describe("vmg to leeward calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVmgToLeeward(vmgToLeewardExample.input)).toEqual({
      ok: true,
      output: vmgToLeewardExample.output,
    });
  });

  it("returns zero when running dead downwind at ninety degrees TWA", () => {
    const r = runVmgToLeeward({ boatSpeedKt: 8, trueWindAngleDeg: 90 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.vmgKt).toBeCloseTo(-8 * Math.cos(Math.PI / 2), 9);
  });

  it("returns full boat speed when sailing dead downwind", () => {
    expect(runVmgToLeeward({ boatSpeedKt: 8, trueWindAngleDeg: 180 })).toEqual({
      ok: true,
      output: { vmgKt: 8 },
    });
  });

  it("rejects angles outside the leeward hemisphere", () => {
    expect(runVmgToLeeward({ boatSpeedKt: 8, trueWindAngleDeg: 89 }).ok).toBe(
      false,
    );
  });
});
