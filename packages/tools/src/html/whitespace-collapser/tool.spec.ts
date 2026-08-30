import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runWhitespaceCollapser, whitespaceCollapserTool, whitespaceCollapserInputSchema, whitespaceCollapserOutputSchema } from "./index.js";
describe("HTML Whitespace Collapser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(whitespaceCollapserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, whitespaceCollapserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, whitespaceCollapserOutputSchema)).toBe(true);
    expect(runWhitespaceCollapser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runWhitespaceCollapser({"html":"a  b  c"})).toEqual({ok: true, output: {"html":"a  b c"}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runWhitespaceCollapser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
