import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, inertAttributeFocusSuppressionLookupInputSchema, inertAttributeFocusSuppressionLookupOutputSchema } from "./index.js";
describe("html/inert-attribute-focus-suppression-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, inertAttributeFocusSuppressionLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, inertAttributeFocusSuppressionLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "ownInert": false,
  "ancestorInert": true,
  "modalDialogEscapes": true
})).toEqual({ ok: true, output: {
  "inert": false,
  "focusSuppressed": false,
  "interactionSuppressed": false
} });
    expect(tool.execute({
  "ownInert": true,
  "ancestorInert": true,
  "modalDialogEscapes": true
})).toEqual({ ok: true, output: {
  "inert": true,
  "focusSuppressed": true,
  "interactionSuppressed": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "ownInert": false,
  "ancestorInert": false,
  "modalDialogEscapes": false
})).toEqual({ ok: true, output: {
  "inert": false,
  "focusSuppressed": false,
  "interactionSuppressed": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "ownInert", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
