import { describe, expect, it } from "vitest";
import { runOverpotential } from "./tool.js";

describe("Overpotential Calculator", () => {
  it("preserves the sign of cathodic overpotential", () => {
    const result = runOverpotential({
      appliedPotentialV: -0.7,
      equilibriumPotentialV: -0.4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.overpotentialV).toBeCloseTo(-0.3, 12);
  });
  it("rejects invalid input", () =>
    expect(runOverpotential(null).ok).toBe(false));
});
