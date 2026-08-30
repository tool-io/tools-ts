import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlPathSegments, urlPathSegmentsTool, urlPathSegmentsInputSchema, urlPathSegmentsOutputSchema } from "./index.js";
describe("URL Path Segments", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlPathSegmentsTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlPathSegmentsInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlPathSegmentsOutputSchema)).toBe(true);
    expect(runUrlPathSegments(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlPathSegments({"url":"https://example.com/"})).toEqual({ok: true, output: {"segments":[""]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlPathSegments({"url":"data:text/plain,hi"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "opaque_path"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlPathSegments(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
