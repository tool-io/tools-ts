import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, randomHexTokenBitsFromCharactersInputSchema, randomHexTokenBitsFromCharactersOutputSchema } from "./index.js";
describe("cryptography/random-hex-token-bits-from-characters", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, randomHexTokenBitsFromCharactersInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, randomHexTokenBitsFromCharactersOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "characters": 16
})).toEqual({ ok: true, output: {
  "bits": "64"
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "characters": 0
})).toEqual({ ok: true, output: {
  "bits": "0"
} });
    expect(tool.execute({
  "characters": 9007199254740991
})).toEqual({ ok: true, output: {
  "bits": "36028797018963964"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "characters", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
