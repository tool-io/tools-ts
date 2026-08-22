import { describe, expect, it } from "vitest";
import { runTropopauseCheck } from "./tool.js";
describe("tropopause check", () => {
  it("returns false below the tropopause", () => {
    const result = runTropopauseCheck({ altitudeFt: 30_000 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.atOrAboveTropopause).toBe(false);
  });
  it("returns true at or above the tropopause", () => {
    const result = runTropopauseCheck({ altitudeFt: 37_000 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.atOrAboveTropopause).toBe(true);
  });
});
