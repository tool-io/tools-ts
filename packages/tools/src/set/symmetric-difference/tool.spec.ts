import { describe, expect, it } from "vitest";
import { runSymmetricDifference } from "./tool.js";
describe("List Symmetric Difference Tool", () => {
  it("calculates a valid result", () => {
    expect(
      runSymmetricDifference({ first: ["a", "b"], second: ["b", "c"] }),
    ).toEqual({ ok: true, output: { values: ["a", "c"] } });
  });
  it("rejects invalid input", () =>
    expect(runSymmetricDifference(null).ok).toBe(false));
});
