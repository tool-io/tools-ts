import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runCommentRemover, commentRemoverTool, commentRemoverInputSchema, commentRemoverOutputSchema } from "./index.js";
describe("HTML Comment Remover", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(commentRemoverTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, commentRemoverInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, commentRemoverOutputSchema)).toBe(true);
    expect(runCommentRemover(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runCommentRemover({"html":"<script>\"<!-- literal -->\"</script><!-- remove -->"})).toEqual({ok: true, output: {"html":"<script>\"<!-- literal -->\"</script>"}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runCommentRemover(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
