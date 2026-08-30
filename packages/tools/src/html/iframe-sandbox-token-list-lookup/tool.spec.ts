import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, iframeSandboxTokenListLookupInputSchema, iframeSandboxTokenListLookupOutputSchema } from "./index.js";
describe("html/iframe-sandbox-token-list-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, iframeSandboxTokenListLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, iframeSandboxTokenListLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "present": true,
  "tokens": ""
})).toEqual({ ok: true, output: {
  "unknown": [],
  "scriptsRestricted": true,
  "opaqueOriginRequired": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "present": false,
  "tokens": ""
})).toEqual({ ok: true, output: {
  "unknown": [],
  "scriptsRestricted": false,
  "opaqueOriginRequired": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "present", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
