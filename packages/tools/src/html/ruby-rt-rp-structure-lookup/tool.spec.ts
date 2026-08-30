import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, rubyRtRpStructureLookupInputSchema, rubyRtRpStructureLookupOutputSchema } from "./index.js";
describe("html/ruby-rt-rp-structure-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, rubyRtRpStructureLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, rubyRtRpStructureLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "tag": "rp"
})).toEqual({ ok: true, output: {
  "role": "fallback-parentheses",
  "directRubyContext": true
} });
    expect(tool.execute({
  "tag": "ruby"
})).toEqual({ ok: true, output: {
  "role": "container",
  "directRubyContext": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "tag", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
