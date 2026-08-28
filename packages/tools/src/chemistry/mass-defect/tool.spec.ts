import { describe, expect, it } from "vitest";
import { runMassDefect } from "./tool.js";

describe("Mass Defect Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMassDefect({
      actualAtomicMassU: 4.002603254,
      neutrons: 2,
      protons: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.massDefectU).toBeCloseTo(0.030377, 5);
  });

  it("rejects invalid input", () => expect(runMassDefect(null).ok).toBe(false));
});
