import { describe, expect, it } from "vitest";
import { runRotate } from "./tool.js";
describe("List Rotation Tool", () => {
  it("calculates a valid result", () => {
    expect(runRotate({ values: ["a", "b", "c"], positions: 1 })).toEqual({
      ok: true,
      output: { values: ["c", "a", "b"] },
    });
  });
  it("rejects invalid input", () => expect(runRotate(null).ok).toBe(false));
});
