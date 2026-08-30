import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, spellcheckTriStateDefaultInheritInputSchema, spellcheckTriStateDefaultInheritOutputSchema } from "./index.js";
describe("html/spellcheck-tri-state-default-inherit", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, spellcheckTriStateDefaultInheritInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, spellcheckTriStateDefaultInheritOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "present": true,
  "value": "",
  "defaultBehavior": "false",
  "parentSpellcheck": false
})).toEqual({ ok: true, output: {
  "attributeState": "true",
  "spellcheck": true
} });
    expect(tool.execute({
  "present": true,
  "value": " false ",
  "defaultBehavior": "inherit",
  "parentSpellcheck": true
})).toEqual({ ok: true, output: {
  "attributeState": "default",
  "spellcheck": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "present": true,
  "value": "false",
  "defaultBehavior": "true",
  "parentSpellcheck": true
})).toEqual({ ok: true, output: {
  "attributeState": "false",
  "spellcheck": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "present", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
