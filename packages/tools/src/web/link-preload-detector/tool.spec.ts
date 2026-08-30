import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runLinkPreloadDetector, linkPreloadDetectorTool, linkPreloadDetectorInputSchema, linkPreloadDetectorOutputSchema } from "./index.js";
describe("LinkPreloadDetector", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(linkPreloadDetectorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, linkPreloadDetectorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, linkPreloadDetectorOutputSchema)).toBe(true);
    expect(runLinkPreloadDetector(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runLinkPreloadDetector({"html":"<script>\"<link rel=preload href=/fake>\"</script>"})).toEqual({ok: true, output: {"hrefs":[]}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runLinkPreloadDetector(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
