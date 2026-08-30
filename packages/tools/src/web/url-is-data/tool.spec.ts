import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlIsData, urlIsDataTool, urlIsDataInputSchema, urlIsDataOutputSchema } from "./index.js";
describe("URL Is Data", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlIsDataTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlIsDataInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlIsDataOutputSchema)).toBe(true);
    expect(runUrlIsData(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlIsData({"url":"https://example.com/"})).toEqual({ok: true, output: {"result":false}}));
  it("matches independent case 2", () => expect(runUrlIsData({"url":"not a URL"})).toEqual({ok: true, output: {"result":false}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlIsData(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
