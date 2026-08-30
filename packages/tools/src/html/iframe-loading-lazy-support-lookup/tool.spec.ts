import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, iframeLoadingLazySupportLookupInputSchema, iframeLoadingLazySupportLookupOutputSchema } from "./index.js";
describe("html/iframe-loading-lazy-support-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, iframeLoadingLazySupportLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, iframeLoadingLazySupportLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "present": true,
  "value": "lazy",
  "supportsLazy": true,
  "scriptingEnabled": false
})).toEqual({ ok: true, output: {
  "state": "lazy",
  "eligibleForLazy": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "present": false,
  "value": "",
  "supportsLazy": true,
  "scriptingEnabled": true
})).toEqual({ ok: true, output: {
  "state": "eager",
  "eligibleForLazy": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "present", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
