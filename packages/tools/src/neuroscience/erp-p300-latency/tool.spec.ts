import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runErpP300Latency, erpP300LatencyTool, erpP300LatencyInputSchema, erpP300LatencyOutputSchema } from "./index.js";
describe("ERP P300 Peak Latency", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(erpP300LatencyTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, erpP300LatencyInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, erpP300LatencyOutputSchema)).toBe(true);
    expect(runErpP300Latency(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runErpP300Latency({"timesMs":[250,350],"amplitudesUv":[4,4],"windowStartMs":250,"windowEndMs":350})).toEqual({ok: true, output: {"latencyMs":250,"peakAmplitudeUv":4}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runErpP300Latency({"timesMs":[300],"amplitudesUv":[-2],"windowStartMs":200,"windowEndMs":600});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "amplitudesUv", code: "missing_positive_peak"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runErpP300Latency(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
