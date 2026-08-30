import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runPreconnectHintParser, preconnectHintParserTool, preconnectHintParserInputSchema, preconnectHintParserOutputSchema } from "./index.js";
describe("PreconnectHintParser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(preconnectHintParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, preconnectHintParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, preconnectHintParserOutputSchema)).toBe(true);
    expect(runPreconnectHintParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runPreconnectHintParser({"html":"<script>\"<link rel=preconnect href=/fake>\"</script>"})).toEqual({ok: true, output: {"hrefs":[]}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runPreconnectHintParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
