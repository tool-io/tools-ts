import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUnicodeToPunycode, unicodeToPunycodeTool, unicodeToPunycodeInputSchema, unicodeToPunycodeOutputSchema } from "./index.js";
describe("Unicode Domain to ASCII", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(unicodeToPunycodeTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, unicodeToPunycodeInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, unicodeToPunycodeOutputSchema)).toBe(true);
    expect(runUnicodeToPunycode(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUnicodeToPunycode({"domain":"mañana.com"})).toEqual({ok: true, output: {"domain":"xn--maana-pta.com"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUnicodeToPunycode({"domain":"a/b"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "domain", code: "invalid_domain"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUnicodeToPunycode(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
