import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, uuidV4RandomnessBitsFixedLookupInputSchema, uuidV4RandomnessBitsFixedLookupOutputSchema } from "./index.js";
describe("cryptography/uuid-v4-randomness-bits-fixed-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, uuidV4RandomnessBitsFixedLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, uuidV4RandomnessBitsFixedLookupOutputSchema)).toBe(true);
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "uuid": "00000000-0000-4000-8000-000000000000"
})).toEqual({ ok: true, output: {
  "randomBits": 122,
  "fixedBits": 6
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "uuid", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
