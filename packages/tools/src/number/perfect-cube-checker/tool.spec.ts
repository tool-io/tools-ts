import { describe, expect, it } from "vitest";
import { runPerfectCubeChecker } from "./tool.js";
describe("Perfect Cube Checker", () => {
  it("calculates a valid result", () =>
    expect(runPerfectCubeChecker({ value: -27 })).toEqual({
      ok: true,
      output: { perfectCube: true, root: -3 },
    }));
  it("rejects invalid input", () =>
    expect(runPerfectCubeChecker(null).ok).toBe(false));
});
