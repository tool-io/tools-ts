import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, requiredReadonlyDisabledDiffTableInputSchema, requiredReadonlyDisabledDiffTableOutputSchema } from "./index.js";
describe("html/required-readonly-disabled-diff-table", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, requiredReadonlyDisabledDiffTableInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, requiredReadonlyDisabledDiffTableOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "type": "checkbox",
  "required": true,
  "readonly": true,
  "disabled": false
})).toEqual({ ok: true, output: {
  "requiredApplies": true,
  "readonlyApplies": false,
  "mutable": true,
  "excludedByDisabled": false,
  "barredFromValidation": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "type": "range",
  "required": true,
  "readonly": true,
  "disabled": true
})).toEqual({ ok: true, output: {
  "requiredApplies": false,
  "readonlyApplies": false,
  "mutable": false,
  "excludedByDisabled": true,
  "barredFromValidation": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "type", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
