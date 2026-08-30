import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, hrThematicBreakSemanticsLookupInputSchema, hrThematicBreakSemanticsLookupOutputSchema } from "./index.js";
describe("html/hr-thematic-break-semantics-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, hrThematicBreakSemanticsLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, hrThematicBreakSemanticsLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "tags": [
    "br",
    "wbr"
  ]
})).toEqual({ ok: true, output: {
  "thematicBreak": [
    false,
    false
  ],
  "breakCount": 0
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "tags": []
})).toEqual({ ok: true, output: {
  "thematicBreak": [],
  "breakCount": 0
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "tags", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
