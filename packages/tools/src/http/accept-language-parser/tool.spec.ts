import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runAcceptLanguageParser, acceptLanguageParserTool, acceptLanguageParserInputSchema, acceptLanguageParserOutputSchema } from "./index.js";
describe("HTTP Accept-Language Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(acceptLanguageParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, acceptLanguageParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, acceptLanguageParserOutputSchema)).toBe(true);
    expect(runAcceptLanguageParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runAcceptLanguageParser({"header":""})).toEqual({ok: true, output: {"languages":[]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runAcceptLanguageParser({"header":"en;q=0.1234"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "malformed_header"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runAcceptLanguageParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
