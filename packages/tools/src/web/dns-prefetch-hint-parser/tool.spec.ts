import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runDnsPrefetchHintParser, dnsPrefetchHintParserTool, dnsPrefetchHintParserInputSchema, dnsPrefetchHintParserOutputSchema } from "./index.js";
describe("DnsPrefetchHintParser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(dnsPrefetchHintParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, dnsPrefetchHintParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, dnsPrefetchHintParserOutputSchema)).toBe(true);
    expect(runDnsPrefetchHintParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runDnsPrefetchHintParser({"html":"<script>\"<link rel=dns-prefetch href=/fake>\"</script>"})).toEqual({ok: true, output: {"hrefs":[]}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runDnsPrefetchHintParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
