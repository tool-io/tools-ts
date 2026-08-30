import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, mnemonicChecksumBitsForWordCountInputSchema, mnemonicChecksumBitsForWordCountOutputSchema } from "./index.js";
describe("cryptography/mnemonic-checksum-bits-for-word-count", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, mnemonicChecksumBitsForWordCountInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, mnemonicChecksumBitsForWordCountOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "wordCount": 15
})).toEqual({ ok: true, output: {
  "entropyBits": 160,
  "checksumBits": 5,
  "encodedBits": 165
} });
    expect(tool.execute({
  "wordCount": 21
})).toEqual({ ok: true, output: {
  "entropyBits": 224,
  "checksumBits": 7,
  "encodedBits": 231
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "wordCount": 24
})).toEqual({ ok: true, output: {
  "entropyBits": 256,
  "checksumBits": 8,
  "encodedBits": 264
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "wordCount", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "wordCount": 13
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "wordCount", code: "invalid_word_count" }] } });
  });

});
