import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, ferisonEio3ValidLookupInputSchema, ferisonEio3ValidLookupOutputSchema } from "./index.js";
describe("logic/ferison-eio3-valid-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, ferisonEio3ValidLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, ferisonEio3ValidLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "nonemptyTerms": [
        "S",
        "M",
        "P"
      ]
    })).toEqual({ ok: true, output: {
      "syllogism": "EIO-3",
      "valid": true,
      "requiredNonemptyTerm": "none"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "nonemptyTerms": []
    })).toEqual({ ok: true, output: {
      "syllogism": "EIO-3",
      "valid": true,
      "requiredNonemptyTerm": "none"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "nonemptyTerms", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["nonemptyTerms"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
});
