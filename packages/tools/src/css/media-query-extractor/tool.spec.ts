import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runMediaQueryExtractor, mediaQueryExtractorTool, mediaQueryExtractorInputSchema, mediaQueryExtractorOutputSchema } from "./index.js";
describe("CSS Media Query Extractor", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(mediaQueryExtractorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, mediaQueryExtractorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, mediaQueryExtractorOutputSchema)).toBe(true);
    expect(runMediaQueryExtractor(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runMediaQueryExtractor({"css":"a::before {content:\"@media fake{}\"}"})).toEqual({ok: true, output: {"queries":[]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runMediaQueryExtractor({"css":"@media screen"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "css", code: "malformed_css"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runMediaQueryExtractor(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
