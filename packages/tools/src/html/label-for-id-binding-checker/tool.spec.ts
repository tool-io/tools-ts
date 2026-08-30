import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, labelForIdBindingCheckerInputSchema, labelForIdBindingCheckerOutputSchema } from "./index.js";
describe("html/label-for-id-binding-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, labelForIdBindingCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, labelForIdBindingCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "hasFor": true,
  "forId": "email",
  "elementIds": [
    "email"
  ],
  "labelable": [
    true
  ],
  "implicitLabelableCount": 0
})).toEqual({ ok: true, output: {
  "bound": true,
  "targetIndex": 0,
  "duplicateId": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "hasFor": false,
  "forId": "",
  "elementIds": [],
  "labelable": [],
  "implicitLabelableCount": 1
})).toEqual({ ok: true, output: {
  "bound": true,
  "targetIndex": -1,
  "duplicateId": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "hasFor", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, labelable: [] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "labelable", code: "length_mismatch" }] } });
  });

});
