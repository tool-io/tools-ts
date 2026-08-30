import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, prefetchPreloadPrerenderDiffLookupInputSchema, prefetchPreloadPrerenderDiffLookupOutputSchema } from "./index.js";
describe("html/prefetch-preload-prerender-diff-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, prefetchPreloadPrerenderDiffLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, prefetchPreloadPrerenderDiffLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "hint": "preload"
})).toEqual({ ok: true, output: {
  "navigation": "current",
  "mechanism": "link",
  "preparesDocument": false
} });
    expect(tool.execute({
  "hint": "prefetch"
})).toEqual({ ok: true, output: {
  "navigation": "future",
  "mechanism": "link",
  "preparesDocument": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "hint", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
