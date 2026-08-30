import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, rolePresentationVsNoneEquivalenceInputSchema, rolePresentationVsNoneEquivalenceOutputSchema } from "./index.js";
describe("html/role-presentation-vs-none-equivalence", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, rolePresentationVsNoneEquivalenceInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, rolePresentationVsNoneEquivalenceOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "role": "presentation",
  "focusableOrInteractive": true,
  "hasGlobalAria": false
})).toEqual({ ok: true, output: {
  "removesOwnImplicitSemantics": false,
  "ignoredByConflict": true
} });
    expect(tool.execute({
  "role": "none",
  "focusableOrInteractive": false,
  "hasGlobalAria": true
})).toEqual({ ok: true, output: {
  "removesOwnImplicitSemantics": false,
  "ignoredByConflict": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "role", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
