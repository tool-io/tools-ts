import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runDebounceFilter, debounceFilterTool, debounceFilterInputSchema, debounceFilterOutputSchema } from "./index.js";
describe("Consecutive Sample Debounce Filter", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(debounceFilterTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, debounceFilterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, debounceFilterOutputSchema)).toBe(true);
    expect(runDebounceFilter(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runDebounceFilter({"samples":[true,false],"initial":false,"requiredSamples":1})).toEqual({ok: true, output: {"states":[true,false]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runDebounceFilter({"samples":[true],"initial":false,"requiredSamples":0});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "requiredSamples", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runDebounceFilter(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
