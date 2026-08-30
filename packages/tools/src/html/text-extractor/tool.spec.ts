import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runTextExtractor, textExtractorTool, textExtractorInputSchema, textExtractorOutputSchema } from "./index.js";
describe("HTML Text Extractor", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(textExtractorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, textExtractorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, textExtractorOutputSchema)).toBe(true);
    expect(runTextExtractor(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runTextExtractor({"html":"<style>a{color:red}</style><p>2 &lt; 3</p>"})).toEqual({ok: true, output: {"text":"2 < 3"}}));
  it("matches independent case 2", () => expect(runTextExtractor({"html":"&#1114112; &unknown;"})).toEqual({ok: true, output: {"text":"� &unknown;"}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runTextExtractor(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
