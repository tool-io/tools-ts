import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, contenteditableInheritanceBehaviorInputSchema, contenteditableInheritanceBehaviorOutputSchema } from "./index.js";
describe("html/contenteditable-inheritance-behavior", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, contenteditableInheritanceBehaviorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, contenteditableInheritanceBehaviorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "present": true,
  "value": " false ",
  "parentEditable": true
})).toEqual({ ok: true, output: {
  "attributeState": "inherit",
  "editable": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "present": false,
  "value": "",
  "parentEditable": false
})).toEqual({ ok: true, output: {
  "attributeState": "inherit",
  "editable": false
} });
    expect(tool.execute({
  "present": true,
  "value": "",
  "parentEditable": false
})).toEqual({ ok: true, output: {
  "attributeState": "true",
  "editable": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "present", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
