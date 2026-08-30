import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, noscriptJsDisabledFallbackInputSchema, noscriptJsDisabledFallbackOutputSchema } from "./index.js";
describe("html/noscript-js-disabled-fallback", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, noscriptJsDisabledFallbackInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, noscriptJsDisabledFallbackOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "scriptingEnabled": true,
  "context": "body"
})).toEqual({ ok: true, output: {
  "fallbackEligible": false,
  "contentsParsedAs": "text",
  "headContentRestricted": false
} });
    expect(tool.execute({
  "scriptingEnabled": false,
  "context": "head"
})).toEqual({ ok: true, output: {
  "fallbackEligible": true,
  "contentsParsedAs": "markup",
  "headContentRestricted": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "scriptingEnabled", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
