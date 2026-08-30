import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, globalAttributesListLookupInputSchema, globalAttributesListLookupOutputSchema } from "./index.js";
describe("html/global-attributes-list-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, globalAttributesListLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, globalAttributesListLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "names": [
    "slot",
    "translate",
    "onclick"
  ]
})).toEqual({ ok: true, output: {
  "isNamedGlobal": [
    true,
    true,
    false
  ],
  "isExtensionFamily": [
    false,
    false,
    false
  ]
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "names": []
})).toEqual({ ok: true, output: {
  "isNamedGlobal": [],
  "isExtensionFamily": []
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "names", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
