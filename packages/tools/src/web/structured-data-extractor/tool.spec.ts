import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runStructuredDataExtractor, structuredDataExtractorTool, structuredDataExtractorInputSchema, structuredDataExtractorOutputSchema } from "./index.js";
describe("JSON-LD Structured Data Extractor", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(structuredDataExtractorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, structuredDataExtractorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, structuredDataExtractorOutputSchema)).toBe(true);
    expect(runStructuredDataExtractor(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runStructuredDataExtractor({"html":"<script>{\"a\":1}</script>"})).toEqual({ok: true, output: {"documents":[]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runStructuredDataExtractor({"html":"<script type=\"application/ld+json\">broken</script>"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "html", code: "malformed_json"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runStructuredDataExtractor(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
