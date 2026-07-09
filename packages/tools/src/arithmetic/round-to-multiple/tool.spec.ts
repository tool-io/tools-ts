import { describe, expect, it } from "vitest";
import { runRoundToMultiple } from "./tool.js";
describe("Round to Multiple Calculator", () => {
  it("calculates a valid result", () =>
    expect(runRoundToMultiple({ value: 13, multiple: 5 })).toEqual({
      ok: true,
      output: { result: 15 },
    }));
  it("rejects invalid input", () =>
    expect(runRoundToMultiple({ value: 1, multiple: 0 }).ok).toBe(false));
});
