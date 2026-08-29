import { describe, expect, it } from "vitest";
import { runTitrationEquivalenceVolume } from "./tool.js";

describe("Titration Equivalence Volume Calculator", () => {
  it("calculates a valid result", () => {
    const result = runTitrationEquivalenceVolume({
      analyteMoles: 1,
      titrantMolarityMolL: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.equivalenceVolumeL).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runTitrationEquivalenceVolume(null).ok).toBe(false));
});
