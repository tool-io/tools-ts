import { describe, expect, it } from "vitest";
import { runRealGasCorrectionA } from "./tool.js";

describe("Real Gas Correction A Calculator", () => {
  it("calculates a valid result", () => {
    const result = runRealGasCorrectionA({
      aAtmL2PerMol2: 1,
      moles: 1,
      volumeL: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctionPressureAtm).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runRealGasCorrectionA(null).ok).toBe(false));
});
