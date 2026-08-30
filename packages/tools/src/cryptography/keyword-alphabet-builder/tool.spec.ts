import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, keywordAlphabetBuilderInputSchema, keywordAlphabetBuilderOutputSchema } from "./index.js";
describe("cryptography/keyword-alphabet-builder", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, keywordAlphabetBuilderInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, keywordAlphabetBuilderOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "keyword": "ZEBRAS"
})).toEqual({ ok: true, output: {
  "alphabet": "ZEBRASCDFGHIJKLMNOPQTUVWXY"
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "keyword": ""
})).toEqual({ ok: true, output: {
  "alphabet": "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "keyword", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
