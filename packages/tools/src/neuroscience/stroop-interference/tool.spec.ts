import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runStroopInterference, stroopInterferenceTool, stroopInterferenceInputSchema, stroopInterferenceOutputSchema } from "./index.js";
describe("Stroop Interference", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(stroopInterferenceTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, stroopInterferenceInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, stroopInterferenceOutputSchema)).toBe(true);
    expect(runStroopInterference(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runStroopInterference({"meanIncongruentMs":480,"meanCongruentMs":510})).toEqual({ok: true, output: {"interferenceMs":-30}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runStroopInterference({"meanIncongruentMs":-10,"meanCongruentMs":560});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "meanIncongruentMs", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runStroopInterference(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
