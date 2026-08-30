import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, templateInertContentNoteInputSchema, templateInertContentNoteOutputSchema } from "./index.js";
describe("html/template-inert-content-note", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, templateInertContentNoteInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, templateInertContentNoteOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "location": "inserted-content"
})).toEqual({ ok: true, output: {
  "inertTemplateContents": false,
  "participatesInDocument": true
} });
    expect(tool.execute({
  "location": "declarative-shadow-root-content"
})).toEqual({ ok: true, output: {
  "inertTemplateContents": false,
  "participatesInDocument": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "location", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
