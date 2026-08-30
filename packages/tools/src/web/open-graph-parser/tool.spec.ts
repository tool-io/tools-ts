import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runOpenGraphParser, openGraphParserTool, openGraphParserInputSchema, openGraphParserOutputSchema } from "./index.js";
describe("Open Graph Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(openGraphParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, openGraphParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, openGraphParserOutputSchema)).toBe(true);
    expect(runOpenGraphParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runOpenGraphParser({"html":"<!-- <meta name=\"description\" content=\"fake\"> --><script>\"<meta name=x content=y>\"</script>"})).toEqual({ok: true, output: {"entries":[]}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runOpenGraphParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
