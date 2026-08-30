import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runSrcsetParser, srcsetParserTool, srcsetParserInputSchema, srcsetParserOutputSchema } from "./index.js";
describe("Image Srcset Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(srcsetParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, srcsetParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, srcsetParserOutputSchema)).toBe(true);
    expect(runSrcsetParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runSrcsetParser({"srcset":"data:image/png;base64,AAAA 1x, large.png 2x"})).toEqual({ok: true, output: {"candidates":[{"url":"data:image/png;base64,AAAA","descriptor":"1x","kind":"density","value":1},{"url":"large.png","descriptor":"2x","kind":"density","value":2}]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runSrcsetParser({"srcset":"a 100w, b 2x"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "srcset", code: "mixed_descriptors"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runSrcsetParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
