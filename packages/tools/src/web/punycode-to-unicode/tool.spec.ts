import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runPunycodeToUnicode, punycodeToUnicodeTool, punycodeToUnicodeInputSchema, punycodeToUnicodeOutputSchema } from "./index.js";
describe("Punycode Domain Decoder", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(punycodeToUnicodeTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, punycodeToUnicodeInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, punycodeToUnicodeOutputSchema)).toBe(true);
    expect(runPunycodeToUnicode(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runPunycodeToUnicode({"domain":"xn--maana-pta.com"})).toEqual({ok: true, output: {"domain":"mañana.com"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runPunycodeToUnicode({"domain":"xn--z.example"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "domain", code: "malformed_punycode"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runPunycodeToUnicode(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
