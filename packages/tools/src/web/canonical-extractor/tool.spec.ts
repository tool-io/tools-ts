import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runCanonicalExtractor, canonicalExtractorTool, canonicalExtractorInputSchema, canonicalExtractorOutputSchema } from "./index.js";
describe("Canonical Link Extractor", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(canonicalExtractorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, canonicalExtractorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, canonicalExtractorOutputSchema)).toBe(true);
    expect(runCanonicalExtractor(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runCanonicalExtractor({"html":"<!-- <link rel=canonical href=/fake> -->"})).toEqual({ok: true, output: {"hrefs":[]}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runCanonicalExtractor(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
