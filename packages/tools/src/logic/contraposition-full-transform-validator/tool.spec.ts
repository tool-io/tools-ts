import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, contrapositionFullTransformValidatorInputSchema, contrapositionFullTransformValidatorOutputSchema } from "./index.js";
describe("logic/contraposition-full-transform-validator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, contrapositionFullTransformValidatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, contrapositionFullTransformValidatorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "kind": "O",
      "subject": "S",
      "predicate": "P"
    })).toEqual({ ok: true, output: {
      "kind": "O",
      "subject": "P",
      "predicate": "S",
      "subjectComplemented": true,
      "predicateComplemented": true,
      "valid": true
    } });
    expect(tool.execute({
      "kind": "E",
      "subject": "S",
      "predicate": "P"
    })).toEqual({ ok: true, output: {
      "kind": "E",
      "subject": "P",
      "predicate": "S",
      "subjectComplemented": true,
      "predicateComplemented": true,
      "valid": false
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "kind": "I",
      "subject": "X",
      "predicate": "X"
    })).toEqual({ ok: true, output: {
      "kind": "I",
      "subject": "X",
      "predicate": "X",
      "subjectComplemented": true,
      "predicateComplemented": true,
      "valid": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "kind", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["kind", "subject", "predicate"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
  it("keeps Boolean literals distinct from identifier atoms", () => {
    for (const field of ["subject", "predicate"] as const) {
      expect(tool.execute({ ...example.input, [field]: "true" })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_format" }] } });
    }
  });
});
