import { describe, expect, it } from "vitest";
import { runEntropyVaporization } from "./tool.js";

describe("Entropy of Vaporization Calculator", () => {
  it("calculates a valid result", () => {
    const result = runEntropyVaporization({
      deltaHVapJPerMol: 1,
      boilingPointK: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.entropyVapJPerMolK).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runEntropyVaporization(null).ok).toBe(false));
});
