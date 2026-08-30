import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, sshKeyFingerprintMd5StyleFormatterInputSchema, sshKeyFingerprintMd5StyleFormatterOutputSchema } from "./index.js";
describe("cryptography/ssh-key-fingerprint-md5-style-formatter", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, sshKeyFingerprintMd5StyleFormatterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sshKeyFingerprintMd5StyleFormatterOutputSchema)).toBe(true);
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "hex": "00000000000000000000000000000000"
})).toEqual({ ok: true, output: {
  "fingerprint": "MD5:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "hex", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
