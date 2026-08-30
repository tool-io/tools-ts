import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlIsBlob, urlIsBlobTool, urlIsBlobInputSchema, urlIsBlobOutputSchema } from "./index.js";
describe("URL Is Blob", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlIsBlobTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlIsBlobInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlIsBlobOutputSchema)).toBe(true);
    expect(runUrlIsBlob(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlIsBlob({"url":"https://example.com/"})).toEqual({ok: true, output: {"result":false}}));
  it("matches independent case 2", () => expect(runUrlIsBlob({"url":"not a URL"})).toEqual({ok: true, output: {"result":false}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlIsBlob(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
