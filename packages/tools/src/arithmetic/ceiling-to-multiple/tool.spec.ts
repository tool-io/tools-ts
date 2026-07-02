import { describe, expect, it } from "vitest";
import { runCeilingToMultiple } from "./tool.js";
describe("Ceiling to Multiple Calculator", () => {
  it("calculates a valid result", () =>
    expect(runCeilingToMultiple({ value: 13, multiple: 5 })).toEqual({
      ok: true,
      output: { result: 15 },
    }));
  it("rejects invalid input", () =>
    expect(runCeilingToMultiple({ value: 1, multiple: 0 }).ok).toBe(false));
});
