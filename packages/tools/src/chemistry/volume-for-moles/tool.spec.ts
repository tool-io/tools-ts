import { describe, expect, it } from "vitest";
import { runVolumeForMoles, volumeForMolesExample } from "./tool.js";

describe("Volume For Moles Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVolumeForMoles(volumeForMolesExample.input)).toEqual({
      ok: true,
      output: volumeForMolesExample.output,
    });
  });

  it("computes two liters at three-quarter molarity", () => {
    expect(runVolumeForMoles({ moles: 1.5, molarity: 0.75 })).toEqual({
      ok: true,
      output: { volumeLiters: 2 },
    });
  });

  it("computes fractional volumes", () => {
    expect(runVolumeForMoles({ moles: 2, molarity: 4 })).toEqual({
      ok: true,
      output: { volumeLiters: 0.5 },
    });
  });

  it("rejects a zero molarity", () => {
    expect(runVolumeForMoles({ moles: 1, molarity: 0 }).ok).toBe(false);
  });

  it("rejects negative moles", () => {
    expect(runVolumeForMoles({ moles: -1, molarity: 1 }).ok).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runVolumeForMoles({ moles: 1 }).ok).toBe(false);
    expect(runVolumeForMoles({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runVolumeForMoles("0.25").ok).toBe(false);
  });
});
