import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runLocalVariationLv, localVariationLvTool, localVariationLvInputSchema, localVariationLvOutputSchema } from "./index.js";
describe("Interspike Local Variation", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(localVariationLvTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, localVariationLvInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, localVariationLvOutputSchema)).toBe(true);
    expect(runLocalVariationLv(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runLocalVariationLv({"intervalsMs":[12,12,12]})).toEqual({ok: true, output: {"localVariation":0}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runLocalVariationLv({"intervalsMs":[0,12]});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "intervalsMs", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runLocalVariationLv(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
