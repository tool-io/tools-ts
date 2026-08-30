import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runTagStripper, tagStripperTool, tagStripperInputSchema, tagStripperOutputSchema } from "./index.js";
describe("HTML Tag Stripper", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(tagStripperTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, tagStripperInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tagStripperOutputSchema)).toBe(true);
    expect(runTagStripper(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runTagStripper({"html":"2 < 3 <!--ignored--> <a title=\"a>b\">ok</a>"})).toEqual({ok: true, output: {"text":"2 < 3  ok"}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runTagStripper(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
