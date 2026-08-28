import { describe, expect, it } from "vitest";
import { runMolarMassFromEffusion } from "./tool.js";
describe("Molar Mass From Effusion Calculator", () => {
  it("identifies O2 from H2 reference", () => {
    const r = runMolarMassFromEffusion({
      referenceMolarMassGMol: 2,
      referenceRate: 4,
      unknownRate: 1,
    });
    if (!r.ok) throw new Error("fail");
    expect(r.output.unknownMolarMassGMol).toBeCloseTo(32, 9);
  });
  it("rejects invalid input", () =>
    expect(runMolarMassFromEffusion(null).ok).toBe(false));
});
