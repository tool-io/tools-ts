import { describe, expect, it } from "vitest";
import {
  levenshteinExample,
  calculateLevenshtein,
  runLevenshtein,
} from "./tool.js";

describe("distance/levenshtein", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLevenshtein(levenshteinExample.input)).toEqual({
      ok: true,
      output: levenshteinExample.output,
    });
  });
  it("rejects invalid input (a)", () => {
    expect(runLevenshtein({ a: 5, b: "x" }).ok).toBe(false);
  });
  it("rejects invalid input (b)", () => {
    expect(runLevenshtein({ a: "x", b: null }).ok).toBe(false);
  });
  it("is symmetric and handles empty operands", () => {
    const forward = runLevenshtein({ a: "flaw", b: "lawn" });
    const backward = runLevenshtein({ a: "lawn", b: "flaw" });
    expect(forward.ok && backward.ok).toBe(true);
    if (forward.ok && backward.ok)
      expect(forward.output.distance).toBe(backward.output.distance);
    expect(runLevenshtein({ a: "", b: "abc" })).toEqual({
      ok: true,
      output: { distance: 3 },
    });
  });
});
