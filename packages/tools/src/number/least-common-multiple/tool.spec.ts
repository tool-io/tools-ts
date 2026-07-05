import { describe, expect, it } from "vitest";
import { runLeastCommonMultiple } from "./tool.js";
describe("Least Common Multiple Calculator", () => {
  it("calculates a valid result", () =>
    expect(runLeastCommonMultiple({ first: 21, second: 6 })).toEqual({
      ok: true,
      output: { leastCommonMultiple: 42 },
    }));
  it("rejects invalid input", () =>
    expect(runLeastCommonMultiple(null).ok).toBe(false));
});
