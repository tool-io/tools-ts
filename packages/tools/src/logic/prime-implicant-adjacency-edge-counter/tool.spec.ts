import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, primeImplicantAdjacencyEdgeCounterInputSchema, primeImplicantAdjacencyEdgeCounterOutputSchema } from "./index.js";
describe("logic/prime-implicant-adjacency-edge-counter", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, primeImplicantAdjacencyEdgeCounterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, primeImplicantAdjacencyEdgeCounterOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "variableCount": 3,
      "minterms": [
        0,
        3
      ]
    })).toEqual({ ok: true, output: {
      "edgeCount": 0
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "variableCount": 0,
      "minterms": [
        0
      ]
    })).toEqual({ ok: true, output: {
      "edgeCount": 0
    } });
    expect(tool.execute({
      "variableCount": 3,
      "minterms": []
    })).toEqual({ ok: true, output: {
      "edgeCount": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "variableCount", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "variableCount": 2,
      "minterms": [
        4
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "minterms.0", code: "out_of_range" }] } });
    expect(tool.execute({
      "variableCount": 2,
      "minterms": [
        1,
        1
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "minterms", code: "duplicate_index" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["variableCount", "minterms"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("rejects non-finite numeric inputs", () => {
    for (const field of ["variableCount"] as const) {
      for (const value of [NaN, Infinity, -Infinity]) {
        expect(tool.execute({ ...example.input, [field]: value })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
      }
    }
  });
  it("counts high-bit neighbors without signed 32-bit truncation", () => {
    expect(tool.execute({ variableCount: 52, minterms: [0, 2251799813685248] })).toEqual({ ok: true, output: { edgeCount: 1 } });
    expect(tool.execute({ variableCount: 40, minterms: [0, 1099511627775] })).toEqual({ ok: true, output: { edgeCount: 0 } });
  });
});
