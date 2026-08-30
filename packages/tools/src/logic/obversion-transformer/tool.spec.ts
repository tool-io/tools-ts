import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, obversionTransformerInputSchema, obversionTransformerOutputSchema } from "./index.js";
describe("logic/obversion-transformer", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, obversionTransformerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, obversionTransformerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "kind": "I",
      "subject": "S",
      "predicate": "P",
      "predicateComplemented": false
    })).toEqual({ ok: true, output: {
      "kind": "O",
      "subject": "S",
      "predicate": "P",
      "predicateComplemented": true
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "kind": "E",
      "subject": "S",
      "predicate": "P",
      "predicateComplemented": true
    })).toEqual({ ok: true, output: {
      "kind": "A",
      "subject": "S",
      "predicate": "P",
      "predicateComplemented": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "kind", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["kind", "subject", "predicate", "predicateComplemented"] as const) {
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
