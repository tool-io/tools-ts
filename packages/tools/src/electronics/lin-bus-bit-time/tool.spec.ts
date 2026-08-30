import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runLinBusBitTime, linBusBitTimeTool, linBusBitTimeInputSchema, linBusBitTimeOutputSchema } from "./index.js";
describe("LIN Bus Bit Time", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(linBusBitTimeTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, linBusBitTimeInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, linBusBitTimeOutputSchema)).toBe(true);
    expect(runLinBusBitTime(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runLinBusBitTime({"bitRateBps":10000})).toEqual({ok: true, output: {"bitTimeMicroseconds":100}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runLinBusBitTime({"bitRateBps":25000});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "bitRateBps", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runLinBusBitTime(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
