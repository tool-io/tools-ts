import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, slotNameFallbackShadowDomLookupInputSchema, slotNameFallbackShadowDomLookupOutputSchema } from "./index.js";
describe("html/slot-name-fallback-shadow-dom-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, slotNameFallbackShadowDomLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, slotNameFallbackShadowDomLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "slotName": "title",
  "earlierSlotNames": [
    "title"
  ],
  "nodeSlotNames": [
    "title"
  ]
})).toEqual({ ok: true, output: {
  "assignedIndices": [],
  "assignedCount": 0,
  "usesFallback": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "slotName": "",
  "earlierSlotNames": [],
  "nodeSlotNames": [
    "",
    "main"
  ]
})).toEqual({ ok: true, output: {
  "assignedIndices": [
    0
  ],
  "assignedCount": 1,
  "usesFallback": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "slotName", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
