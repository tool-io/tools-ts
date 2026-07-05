import { describe, expect, it } from "vitest";
import { runIntersection } from "./tool.js";
describe("List Intersection Tool", () => {
  it("calculates a valid result", () => {
    expect(runIntersection({ first: ["a", "b"], second: ["b", "c"] })).toEqual({
      ok: true,
      output: { values: ["b"] },
    });
  });
  it("rejects invalid input", () =>
    expect(runIntersection(null).ok).toBe(false));
});
