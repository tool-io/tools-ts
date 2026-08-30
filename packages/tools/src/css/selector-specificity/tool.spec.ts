import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runSelectorSpecificity, selectorSpecificityTool, selectorSpecificityInputSchema, selectorSpecificityOutputSchema } from "./index.js";
describe("CSS Selector Specificity", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(selectorSpecificityTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, selectorSpecificityInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, selectorSpecificityOutputSchema)).toBe(true);
    expect(runSelectorSpecificity(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runSelectorSpecificity({"selectors":"li:nth-child(2n of .active, #selected)::before"})).toEqual({ok: true, output: {"selectors":[{"selector":"li:nth-child(2n of .active, #selected)::before","specificity":{"ids":1,"classes":1,"types":2}}]}}));
  it("matches independent case 2", () => expect(runSelectorSpecificity({"selectors":"svg|a[data-x=\"#fake\"]"})).toEqual({ok: true, output: {"selectors":[{"selector":"svg|a[data-x=\"#fake\"]","specificity":{"ids":0,"classes":1,"types":1}}]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runSelectorSpecificity({"selectors":"& .child"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "selectors", code: "malformed_selector"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runSelectorSpecificity(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
