import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, nullCipherNthLetterExtractInputSchema, nullCipherNthLetterExtractOutputSchema } from "./index.js";
describe("cryptography/null-cipher-nth-letter-extract", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, nullCipherNthLetterExtractInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, nullCipherNthLetterExtractOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "text": "abcde",
  "step": 2,
  "offset": 1
})).toEqual({ ok: true, output: {
  "decoded": "ace"
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "text": "",
  "step": 1,
  "offset": 1
})).toEqual({ ok: true, output: {
  "decoded": ""
} });
    expect(tool.execute({
  "text": "\ud83e\uddedx\ud83e\uddedy",
  "step": 2,
  "offset": 1
})).toEqual({ ok: true, output: {
  "decoded": "\ud83e\udded\ud83e\udded"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "text", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
