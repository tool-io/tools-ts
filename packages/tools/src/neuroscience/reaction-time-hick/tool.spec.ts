import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runReactionTimeHick, reactionTimeHickTool, reactionTimeHickInputSchema, reactionTimeHickOutputSchema } from "./index.js";
describe("Hick Choice Reaction Time", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(reactionTimeHickTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, reactionTimeHickInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, reactionTimeHickOutputSchema)).toBe(true);
    expect(runReactionTimeHick(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runReactionTimeHick({"choices":1,"interceptMs":180,"slopeMsPerBit":60})).toEqual({ok: true, output: {"informationBits":0,"reactionTimeMs":180}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runReactionTimeHick({"choices":1,"interceptMs":-10,"slopeMsPerBit":50});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "interceptMs", code: "invalid_prediction"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runReactionTimeHick(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
