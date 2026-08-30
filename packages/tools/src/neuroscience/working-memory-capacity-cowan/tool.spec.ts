import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runWorkingMemoryCapacityCowan, workingMemoryCapacityCowanTool, workingMemoryCapacityCowanInputSchema, workingMemoryCapacityCowanOutputSchema } from "./index.js";
describe("Cowan Working Memory Capacity", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(workingMemoryCapacityCowanTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, workingMemoryCapacityCowanInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, workingMemoryCapacityCowanOutputSchema)).toBe(true);
    expect(runWorkingMemoryCapacityCowan(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runWorkingMemoryCapacityCowan({"setSize":4,"hitRate":0.25,"falseAlarmRate":0.5})).toEqual({ok: true, output: {"capacityItems":-1}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runWorkingMemoryCapacityCowan({"setSize":4,"hitRate":90,"falseAlarmRate":0.15});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "hitRate", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runWorkingMemoryCapacityCowan(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
