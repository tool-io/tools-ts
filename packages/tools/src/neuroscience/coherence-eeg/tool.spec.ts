import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runCoherenceEeg, coherenceEegTool, coherenceEegInputSchema, coherenceEegOutputSchema } from "./index.js";
describe("EEG Magnitude Squared Coherence", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(coherenceEegTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, coherenceEegInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, coherenceEegOutputSchema)).toBe(true);
    expect(runCoherenceEeg(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runCoherenceEeg({"autoSpectrumX":1,"autoSpectrumY":1,"crossSpectrumReal":0,"crossSpectrumImaginary":1})).toEqual({ok: true, output: {"coherence":1}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runCoherenceEeg({"autoSpectrumX":1,"autoSpectrumY":1,"crossSpectrumReal":2,"crossSpectrumImaginary":0});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "crossSpectrumReal", code: "inconsistent_spectra"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runCoherenceEeg(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
