import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runFlankerCongruencyEffect, flankerCongruencyEffectTool, flankerCongruencyEffectInputSchema, flankerCongruencyEffectOutputSchema } from "./index.js";
describe("Flanker Congruency Effect", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(flankerCongruencyEffectTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, flankerCongruencyEffectInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, flankerCongruencyEffectOutputSchema)).toBe(true);
    expect(runFlankerCongruencyEffect(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runFlankerCongruencyEffect({"meanIncongruentMs":480,"meanCongruentMs":510})).toEqual({ok: true, output: {"congruencyEffectMs":-30}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runFlankerCongruencyEffect({"meanIncongruentMs":-10,"meanCongruentMs":560});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "meanIncongruentMs", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runFlankerCongruencyEffect(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
