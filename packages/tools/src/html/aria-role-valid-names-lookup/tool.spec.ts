import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, ariaRoleValidNamesLookupInputSchema, ariaRoleValidNamesLookupOutputSchema } from "./index.js";
describe("html/aria-role-valid-names-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, ariaRoleValidNamesLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, ariaRoleValidNamesLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "roles": [
    "meter",
    "time",
    "caption",
    "foo"
  ]
})).toEqual({ ok: true, output: {
  "valid": [
    true,
    true,
    true,
    false
  ],
  "abstract": [
    false,
    false,
    false,
    false
  ]
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "roles": []
})).toEqual({ ok: true, output: {
  "valid": [],
  "abstract": []
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "roles", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
