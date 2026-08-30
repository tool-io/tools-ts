import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runPrerenderHintParser, prerenderHintParserTool, prerenderHintParserInputSchema, prerenderHintParserOutputSchema } from "./index.js";
describe("PrerenderHintParser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(prerenderHintParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, prerenderHintParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, prerenderHintParserOutputSchema)).toBe(true);
    expect(runPrerenderHintParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runPrerenderHintParser({"html":"<script>\"<link rel=prerender href=/fake>\"</script>"})).toEqual({ok: true, output: {"hrefs":[]}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runPrerenderHintParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
