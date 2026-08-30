import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runEepromWearOffset, eepromWearOffsetTool, eepromWearOffsetInputSchema, eepromWearOffsetOutputSchema } from "./index.js";
describe("EEPROM Round Robin Slot Offset", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(eepromWearOffsetTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, eepromWearOffsetInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, eepromWearOffsetOutputSchema)).toBe(true);
    expect(runEepromWearOffset(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runEepromWearOffset({"memoryBytes":65,"slotBytes":16,"writeIndex":8})).toEqual({ok: true, output: {"offsetBytes":0,"slotIndex":0,"slotCount":4}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runEepromWearOffset({"memoryBytes":16,"slotBytes":17,"writeIndex":0});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "slotBytes", code: "slot_too_large"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runEepromWearOffset(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
