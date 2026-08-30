import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runEmailObfuscator, emailObfuscatorTool, emailObfuscatorInputSchema, emailObfuscatorOutputSchema } from "./index.js";
describe("Email HTML Entity Obfuscator", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(emailObfuscatorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, emailObfuscatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, emailObfuscatorOutputSchema)).toBe(true);
    expect(runEmailObfuscator(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runEmailObfuscator({"email":"a@b"})).toEqual({ok: true, output: {"encoded":"&#97;&#64;&#98;"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runEmailObfuscator({"email":"a@@b"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "email", code: "malformed_email"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runEmailObfuscator(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
