import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, entropyBitsFromCharsetLengthInputSchema, entropyBitsFromCharsetLengthOutputSchema } from "./index.js";
describe("cryptography/entropy-bits-from-charset-length", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, entropyBitsFromCharsetLengthInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, entropyBitsFromCharsetLengthOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "alphabetSize": 16,
  "length": 8
})).toEqual({ ok: true, output: {
  "bits": 32
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "alphabetSize": 1,
  "length": 100
})).toEqual({ ok: true, output: {
  "bits": 0
} });
    expect(tool.execute({
  "alphabetSize": 64,
  "length": 0
})).toEqual({ ok: true, output: {
  "bits": 0
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "alphabetSize", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
