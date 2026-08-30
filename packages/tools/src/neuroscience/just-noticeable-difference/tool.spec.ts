import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runJustNoticeableDifference, justNoticeableDifferenceTool, justNoticeableDifferenceInputSchema, justNoticeableDifferenceOutputSchema } from "./index.js";
describe("Weber Law Just Noticeable Difference", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(justNoticeableDifferenceTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, justNoticeableDifferenceInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, justNoticeableDifferenceOutputSchema)).toBe(true);
    expect(runJustNoticeableDifference(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runJustNoticeableDifference({"weberFraction":0,"baselineMagnitude":200})).toEqual({ok: true, output: {"justNoticeableIncrement":0}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runJustNoticeableDifference({"weberFraction":-0.1,"baselineMagnitude":200});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "weberFraction", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runJustNoticeableDifference(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
