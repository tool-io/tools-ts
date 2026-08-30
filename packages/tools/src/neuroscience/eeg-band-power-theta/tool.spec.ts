import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runEegBandPowerTheta, eegBandPowerThetaTool, eegBandPowerThetaInputSchema, eegBandPowerThetaOutputSchema } from "./index.js";
describe("EEG Theta Band Power", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(eegBandPowerThetaTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, eegBandPowerThetaInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, eegBandPowerThetaOutputSchema)).toBe(true);
    expect(runEegBandPowerTheta(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runEegBandPowerTheta({"frequenciesHz":[4,4.5],"psdUv2PerHz":[2,4],"binWidthHz":0.5})).toEqual({ok: true, output: {"powerUv2":3}}));
  it("matches independent case 2", () => expect(runEegBandPowerTheta({"frequenciesHz":[8],"psdUv2PerHz":[9],"binWidthHz":1})).toEqual({ok: true, output: {"powerUv2":0}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runEegBandPowerTheta({"frequenciesHz":[4,6],"psdUv2PerHz":[2,4],"binWidthHz":1});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "binWidthHz", code: "nonuniform_spectrum"});
  });
  it("reports invalid case 2 at its input field", () => {
    const result = runEegBandPowerTheta({"frequenciesHz":[4],"psdUv2PerHz":[1,2],"binWidthHz":1});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "frequenciesHz", code: "invalid_spectrum"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runEegBandPowerTheta(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
