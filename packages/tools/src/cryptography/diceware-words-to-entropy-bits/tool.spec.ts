import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, dicewareWordsToEntropyBitsInputSchema, dicewareWordsToEntropyBitsOutputSchema } from "./index.js";
describe("cryptography/diceware-words-to-entropy-bits", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, dicewareWordsToEntropyBitsInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, dicewareWordsToEntropyBitsOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "wordListSize": 1024,
  "wordCount": 4
})).toEqual({ ok: true, output: {
  "bits": 40
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "wordListSize": 7776,
  "wordCount": 0
})).toEqual({ ok: true, output: {
  "bits": 0
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "wordListSize", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
