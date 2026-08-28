import { describe, expect, it } from "vitest";
import { runReducedVolume } from "./tool.js";

describe("Reduced Volume Calculator", () => {
  it("calculates a valid result", () => {
    const result = runReducedVolume({ volumeL: 1, criticalVolumeLMol: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.reducedVolume).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runReducedVolume(null).ok).toBe(false));
});
