import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlIsAbsolute, urlIsAbsoluteTool, urlIsAbsoluteInputSchema, urlIsAbsoluteOutputSchema } from "./index.js";
describe("URL Is Absolute", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlIsAbsoluteTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlIsAbsoluteInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlIsAbsoluteOutputSchema)).toBe(true);
    expect(runUrlIsAbsolute(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlIsAbsolute({"url":"mailto:hello@example.com"})).toEqual({ok: true, output: {"result":true}}));
  it("matches independent case 2", () => expect(runUrlIsAbsolute({"url":"https://["})).toEqual({ok: true, output: {"result":false}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlIsAbsolute(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
