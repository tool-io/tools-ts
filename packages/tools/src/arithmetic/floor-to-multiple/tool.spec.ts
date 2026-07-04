import { describe, expect, it } from "vitest";
import { runFloorToMultiple } from "./tool.js";
describe("Floor to Multiple Calculator", () => {
  it("calculates a valid result", () =>
    expect(runFloorToMultiple({ value: 13, multiple: 5 })).toEqual({
      ok: true,
      output: { result: 10 },
    }));
  it("rejects invalid input", () =>
    expect(runFloorToMultiple({ value: 1, multiple: 0 }).ok).toBe(false));
});
