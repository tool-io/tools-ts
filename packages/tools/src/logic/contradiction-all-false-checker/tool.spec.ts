import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, contradictionAllFalseCheckerInputSchema, contradictionAllFalseCheckerOutputSchema } from "./index.js";
describe("logic/contradiction-all-false-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, contradictionAllFalseCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, contradictionAllFalseCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        false,
        true
      ]
    })).toEqual({ ok: true, output: {
      "contradiction": false
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": [
        false
      ]
    })).toEqual({ ok: true, output: {
      "contradiction": true
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "values": [
        false,
        false,
        false
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "incomplete_table" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["values"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
});
