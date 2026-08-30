import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runLanguageTagParser, languageTagParserTool, languageTagParserInputSchema, languageTagParserOutputSchema } from "./index.js";
describe("Language Tag Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(languageTagParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, languageTagParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, languageTagParserOutputSchema)).toBe(true);
    expect(runLanguageTagParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runLanguageTagParser({"tag":"en-US"})).toEqual({ok: true, output: {"canonical":"en-US","language":"en","script":"","region":"US","baseName":"en-US"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runLanguageTagParser({"tag":"en_US"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "tag", code: "invalid_language_tag"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runLanguageTagParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
