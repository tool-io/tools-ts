import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlIsRelative, urlIsRelativeTool, urlIsRelativeInputSchema, urlIsRelativeOutputSchema } from "./index.js";
describe("URL Is Relative", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlIsRelativeTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlIsRelativeInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlIsRelativeOutputSchema)).toBe(true);
    expect(runUrlIsRelative(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlIsRelative({"url":"mailto:hello@example.com"})).toEqual({ok: true, output: {"result":false}}));
  it("matches independent case 2", () => expect(runUrlIsRelative({"url":"https://["})).toEqual({ok: true, output: {"result":false}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlIsRelative(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
