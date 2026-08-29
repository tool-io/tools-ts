import { describe, expect, it } from "vitest";
import { runVanDerWaalsVolumeCorrection } from "./tool.js";

describe("Van der Waals Volume Correction Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runVanDerWaalsVolumeCorrection({ bLPerMol: 0.0391, moles: 2 }),
    ).toEqual({ ok: true, output: { excludedVolumeL: 0.0782 } });
  });

  it("rejects invalid input", () =>
    expect(runVanDerWaalsVolumeCorrection(null).ok).toBe(false));
});
