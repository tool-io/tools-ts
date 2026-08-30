import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runClockDividerFinder, clockDividerFinderTool, clockDividerFinderInputSchema, clockDividerFinderOutputSchema } from "./index.js";
describe("Integer Clock Divider Finder", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(clockDividerFinderTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, clockDividerFinderInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, clockDividerFinderOutputSchema)).toBe(true);
    expect(runClockDividerFinder(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runClockDividerFinder({"clockHz":48000000,"targetHz":6000000,"maximumDivider":32})).toEqual({ok: true, output: {"divider":8,"actualHz":6000000,"errorPercent":0}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runClockDividerFinder({"clockHz":1,"targetHz":1,"maximumDivider":0});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "maximumDivider", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runClockDividerFinder(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
