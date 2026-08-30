import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runCanBitTiming, canBitTimingTool, canBitTimingInputSchema, canBitTimingOutputSchema } from "./index.js";
describe("CAN Bit Timing Calculator", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(canBitTimingTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, canBitTimingInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, canBitTimingOutputSchema)).toBe(true);
    expect(runCanBitTiming(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runCanBitTiming({"clockHz":16000000,"prescaler":2,"segment1":11,"segment2":4})).toEqual({ok: true, output: {"bitrate":500000,"samplePointPercent":75,"quantumSeconds":1.25e-07}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runCanBitTiming({"clockHz":0,"prescaler":1,"segment1":11,"segment2":4});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "clockHz", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runCanBitTiming(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
