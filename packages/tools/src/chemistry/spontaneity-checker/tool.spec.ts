import { describe, expect, it } from "vitest";
import { runSpontaneityChecker } from "./tool.js";

describe("Spontaneity Checker", () => {
  it("calculates a valid result", () => {
    const result = runSpontaneityChecker({ deltaGKJPerMol: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.classification).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runSpontaneityChecker(null).ok).toBe(false));
});
