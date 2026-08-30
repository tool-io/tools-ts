import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runPhaseLockingValue, phaseLockingValueTool, phaseLockingValueInputSchema, phaseLockingValueOutputSchema } from "./index.js";
describe("Phase Locking Value", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(phaseLockingValueTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, phaseLockingValueInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, phaseLockingValueOutputSchema)).toBe(true);
    expect(runPhaseLockingValue(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runPhaseLockingValue({"phaseDifferencesRad":[0,0,0]})).toEqual({ok: true, output: {"plv":1}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runPhaseLockingValue({"phaseDifferencesRad":[]});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "phaseDifferencesRad", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runPhaseLockingValue(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
