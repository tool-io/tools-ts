import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, acrosticFirstLetterExtractorInputSchema, acrosticFirstLetterExtractorOutputSchema } from "./index.js";
describe("cryptography/acrostic-first-letter-extractor", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, acrosticFirstLetterExtractorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, acrosticFirstLetterExtractorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "text": "  Tiny\tTools\nWork "
})).toEqual({ ok: true, output: {
  "acrostic": "TTW"
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "text": ""
})).toEqual({ ok: true, output: {
  "acrostic": ""
} });
    expect(tool.execute({
  "text": "\ud83e\udded north"
})).toEqual({ ok: true, output: {
  "acrostic": "\ud83e\uddedn"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "text", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
