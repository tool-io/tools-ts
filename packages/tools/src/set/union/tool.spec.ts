import { describe, expect, it } from "vitest";
import { runUnion } from "./tool.js";
describe("List Union Tool", () => {
  it("calculates a valid result", () => {
    expect(runUnion({ first: ["a", "b"], second: ["b", "c"] })).toEqual({
      ok: true,
      output: { values: ["a", "b", "c"] },
    });
  });
  it("rejects invalid input", () => expect(runUnion(null).ok).toBe(false));
});
