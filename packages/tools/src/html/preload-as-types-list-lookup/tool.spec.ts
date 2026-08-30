import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, preloadAsTypesListLookupInputSchema, preloadAsTypesListLookupOutputSchema } from "./index.js";
describe("html/preload-as-types-list-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, preloadAsTypesListLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, preloadAsTypesListLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "values": [
    "document",
    "audio",
    "image"
  ]
})).toEqual({ ok: true, output: {
  "valid": [
    false,
    false,
    true
  ],
  "fetchDestinations": [
    "",
    "",
    "image"
  ]
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "values": []
})).toEqual({ ok: true, output: {
  "valid": [],
  "fetchDestinations": []
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
