import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runWeberFraction, weberFractionTool, weberFractionInputSchema, weberFractionOutputSchema } from "./index.js";
describe("Weber Fraction", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(weberFractionTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, weberFractionInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, weberFractionOutputSchema)).toBe(true);
    expect(runWeberFraction(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runWeberFraction({"justNoticeableIncrement":0,"baselineMagnitude":100})).toEqual({ok: true, output: {"weberFraction":0}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runWeberFraction({"justNoticeableIncrement":5,"baselineMagnitude":0});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "baselineMagnitude", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runWeberFraction(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
