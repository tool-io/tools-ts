import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runSpikeSortingIsi, spikeSortingIsiTool, spikeSortingIsiInputSchema, spikeSortingIsiOutputSchema } from "./index.js";
describe("Spike Train Interspike Intervals", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(spikeSortingIsiTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, spikeSortingIsiInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, spikeSortingIsiOutputSchema)).toBe(true);
    expect(runSpikeSortingIsi(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runSpikeSortingIsi({"spikeTimesMs":[-5,0,8]})).toEqual({ok: true, output: {"intervalsMs":[5,8]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runSpikeSortingIsi({"spikeTimesMs":[1,1]});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "spikeTimesMs", code: "unordered_times"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runSpikeSortingIsi(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
