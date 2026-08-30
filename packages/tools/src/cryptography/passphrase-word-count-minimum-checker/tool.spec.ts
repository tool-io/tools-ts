import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, passphraseWordCountMinimumCheckerInputSchema, passphraseWordCountMinimumCheckerOutputSchema } from "./index.js";
describe("cryptography/passphrase-word-count-minimum-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, passphraseWordCountMinimumCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, passphraseWordCountMinimumCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "wordListSize": 1024,
  "wordCount": 4,
  "targetBits": 40
})).toEqual({ ok: true, output: {
  "minimumWords": 4,
  "meetsTarget": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "wordListSize": 2,
  "wordCount": 0,
  "targetBits": 0
})).toEqual({ ok: true, output: {
  "minimumWords": 0,
  "meetsTarget": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "wordListSize", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
