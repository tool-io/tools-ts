import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, bip32DerivationPathDepthParserCheckerInputSchema, bip32DerivationPathDepthParserCheckerOutputSchema } from "./index.js";
describe("cryptography/bip32-derivation-path-depth-parser-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, bip32DerivationPathDepthParserCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, bip32DerivationPathDepthParserCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "path": "M/0/2"
})).toEqual({ ok: true, output: {
  "root": "public",
  "depth": 2,
  "indices": [
    0,
    2
  ],
  "hardened": [
    false,
    false
  ]
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "path": "m"
})).toEqual({ ok: true, output: {
  "root": "private",
  "depth": 0,
  "indices": [],
  "hardened": []
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "path", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "path": "M/0'"
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "path", code: "hardened_public" }] } });
    expect(tool.execute({
  "path": "m/2147483648"
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "path", code: "index_range" }] } });
  });

  it("bounds serialized depth and encoded child indices", () => {
    expect(tool.execute({ path: "m/2147483647'" })).toEqual({ ok: true, output: { root: "private", depth: 1, indices: [4294967295], hardened: [true] } });
    expect(tool.execute({ path: "m" + "/0".repeat(256) })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "path", code: "depth_limit" }] } });
    expect(tool.execute({ path: "m/1\n" })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "path", code: "invalid_component" }] } });
  });
});
