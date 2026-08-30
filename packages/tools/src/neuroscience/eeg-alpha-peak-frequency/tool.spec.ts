import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runEegAlphaPeakFrequency, eegAlphaPeakFrequencyTool, eegAlphaPeakFrequencyInputSchema, eegAlphaPeakFrequencyOutputSchema } from "./index.js";
describe("EEG Alpha Peak Frequency", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(eegAlphaPeakFrequencyTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, eegAlphaPeakFrequencyInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, eegAlphaPeakFrequencyOutputSchema)).toBe(true);
    expect(runEegAlphaPeakFrequency(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runEegAlphaPeakFrequency({"frequenciesHz":[8,9],"psdUv2PerHz":[6,6]})).toEqual({ok: true, output: {"peakFrequencyHz":8,"peakPsdUv2PerHz":6}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runEegAlphaPeakFrequency({"frequenciesHz":[12],"psdUv2PerHz":[1]});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "frequenciesHz", code: "missing_alpha_bins"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runEegAlphaPeakFrequency(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
