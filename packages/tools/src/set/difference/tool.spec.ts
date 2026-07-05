import { describe, expect, it } from "vitest";
import { runDifference } from "./tool.js";
describe("List Difference Tool", () => {
  it("calculates a valid result", () => {
    expect(runDifference({ first: ["a", "b"], second: ["b", "c"] })).toEqual({
      ok: true,
      output: { values: ["a"] },
    });
  });
  it("rejects invalid input", () => expect(runDifference(null).ok).toBe(false));
});
