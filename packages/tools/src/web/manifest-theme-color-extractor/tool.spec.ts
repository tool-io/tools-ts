import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runManifestThemeColorExtractor, manifestThemeColorExtractorTool, manifestThemeColorExtractorInputSchema, manifestThemeColorExtractorOutputSchema } from "./index.js";
describe("ManifestThemeColorExtractor", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(manifestThemeColorExtractorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, manifestThemeColorExtractorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, manifestThemeColorExtractorOutputSchema)).toBe(true);
    expect(runManifestThemeColorExtractor(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runManifestThemeColorExtractor({"manifest":"{}"})).toEqual({ok: true, output: {"value":"","found":false}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runManifestThemeColorExtractor({"manifest":"{"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "manifest", code: "malformed_json"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runManifestThemeColorExtractor(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
