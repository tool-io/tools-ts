import { describe, expect, it } from "vitest";
import { runEntropyFusion } from "./tool.js";
describe("Entropy of Fusion Calculator", () => {
  it("6000 J/mol at 300K gives 20 J/mol/K", () => {
    const r = runEntropyFusion({
      deltaHFusionJPerMol: 6000,
      meltingPointK: 300,
    });
    if (!r.ok) throw new Error("fail");
    expect(r.output.entropyFusionJPerMolK).toBeCloseTo(20, 6);
  });
  it("rejects invalid input", () =>
    expect(runEntropyFusion(null).ok).toBe(false));
});
