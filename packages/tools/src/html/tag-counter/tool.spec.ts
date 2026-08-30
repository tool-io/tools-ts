import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runTagCounter, tagCounterTool, tagCounterInputSchema, tagCounterOutputSchema } from "./index.js";
describe("HTML Tag Counter", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(tagCounterTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, tagCounterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tagCounterOutputSchema)).toBe(true);
    expect(runTagCounter(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runTagCounter({"html":"<div title=\"x > y\"><br></div>"})).toEqual({ok: true, output: {"count":2}}));
  it("matches independent case 2", () => expect(runTagCounter({"html":"2 < 3 and no tags"})).toEqual({ok: true, output: {"count":0}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runTagCounter(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
