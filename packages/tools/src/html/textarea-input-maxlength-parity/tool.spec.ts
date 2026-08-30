import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, textareaInputMaxlengthParityInputSchema, textareaInputMaxlengthParityOutputSchema } from "./index.js";
describe("html/textarea-input-maxlength-parity", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, textareaInputMaxlengthParityInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, textareaInputMaxlengthParityOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "value": "abc",
  "maxlength": 3
})).toEqual({ ok: true, output: {
  "codeUnits": 3,
  "withinLimit": true,
  "excess": 0
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "value": "",
  "maxlength": 0
})).toEqual({ ok: true, output: {
  "codeUnits": 0,
  "withinLimit": true,
  "excess": 0
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "value", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("counts combining characters and supplied LF API line breaks", () => {
    expect(tool.execute({ value: "e\u0301\n", maxlength: 2 })).toEqual({ ok: true, output: { codeUnits: 3, withinLimit: false, excess: 1 } });
  });
});
