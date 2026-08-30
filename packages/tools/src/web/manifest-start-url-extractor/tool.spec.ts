import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runManifestStartUrlExtractor, manifestStartUrlExtractorTool, manifestStartUrlExtractorInputSchema, manifestStartUrlExtractorOutputSchema } from "./index.js";
describe("ManifestStartUrlExtractor", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(manifestStartUrlExtractorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, manifestStartUrlExtractorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, manifestStartUrlExtractorOutputSchema)).toBe(true);
    expect(runManifestStartUrlExtractor(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runManifestStartUrlExtractor({"manifest":"{}"})).toEqual({ok: true, output: {"value":"","found":false}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runManifestStartUrlExtractor({"manifest":"{"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "manifest", code: "malformed_json"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runManifestStartUrlExtractor(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
