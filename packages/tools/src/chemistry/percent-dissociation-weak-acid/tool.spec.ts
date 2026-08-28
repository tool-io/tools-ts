import { describe, expect, it } from "vitest";
import { runPercentDissociationWeakAcid } from "./tool.js";
describe("Percent Dissociation Weak Acid Calculator", () => {
  it("uses the exact quadratic-equilibrium result", () => {
    const r = runPercentDissociationWeakAcid({
      concentrationMolL: 0.01,
      ka: 1e-6,
    });
    if (!r.ok) throw new Error("fail");
    expect(r.output.percentDissociation).toBeCloseTo(0.9950124999218761, 12);
  });
  it("rejects invalid input", () =>
    expect(runPercentDissociationWeakAcid(null).ok).toBe(false));
});
