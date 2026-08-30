import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runMetaTagParser, metaTagParserTool, metaTagParserInputSchema, metaTagParserOutputSchema } from "./index.js";
describe("Meta Tag Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(metaTagParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, metaTagParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, metaTagParserOutputSchema)).toBe(true);
    expect(runMetaTagParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runMetaTagParser({"html":"<!-- <meta name=\"description\" content=\"fake\"> --><script>\"<meta name=x content=y>\"</script>"})).toEqual({ok: true, output: {"entries":[]}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runMetaTagParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
