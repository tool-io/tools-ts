import { describe, expect, it } from "vitest";
import { runRealGasCorrectionB } from "./tool.js";

describe("Real Gas Correction B Calculator", () => {
  it("calculates a valid result", () => {
    const result = runRealGasCorrectionB({ bLPerMol: 1, moles: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.excludedVolumeL).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runRealGasCorrectionB(null).ok).toBe(false));
});
