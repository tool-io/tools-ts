import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateEditDistance,
  editDistanceExample,
  editDistanceTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateEditDistance>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Edit Distance", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = editDistanceTool.execute(editDistanceExample.input);
    expect(result).toEqual({ ok: true, output: editDistanceExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(editDistanceTool.id).toBe("text/edit-distance");
    expect(validateToolContract(editDistanceTool)).toEqual([]);
  });

  it("handles identical, empty, and disjoint strings", () => {
    expect(calculateEditDistance({ a: "same", b: "same" })).toMatchObject({
      output: { distance: 0 },
    });
    expect(calculateEditDistance({ a: "", b: "abc" })).toMatchObject({
      output: { distance: 3 },
    });
    expect(calculateEditDistance({ a: "abc", b: "" })).toMatchObject({
      output: { distance: 3 },
    });
    expect(calculateEditDistance({ a: "abcd", b: "xyz" })).toMatchObject({
      output: { distance: 4 },
    });
  });

  it("compares by Unicode code points", () => {
    const result = calculateEditDistance({ a: "cafe", b: "caf\u00E9" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.distance).toBe(1);
    const composed = calculateEditDistance({
      a: "caf\u00E9",
      b: "cafe\u0301",
    });
    expect(composed.ok).toBe(true);
    // No normalization: composed e-acute vs e + combining acute is two
    // code-point edits.
    if (composed.ok) expect(composed.output.distance).toBe(2);
  });

  it("rejects missing or oversized inputs", () => {
    expect(calculateEditDistance(null).ok).toBe(false);
    expect(issueCodes(calculateEditDistance({}))).toEqual([
      "a_required",
      "b_required",
    ]);
    const big = "x".repeat(2049);
    expect(issueCodes(calculateEditDistance({ a: big, b: "y" }))).toEqual([
      "a_invalid",
    ]);
    expect(issueCodes(calculateEditDistance({ a: 1, b: "y" }))).toEqual([
      "a_invalid",
    ]);
    expect(issueCodes(calculateEditDistance({ a: "x" }))).toEqual([
      "b_required",
    ]);
  });
});
