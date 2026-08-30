import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runFanoFactor, fanoFactorTool, fanoFactorInputSchema, fanoFactorOutputSchema } from "./index.js";
describe("Spike Count Fano Factor", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(fanoFactorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, fanoFactorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, fanoFactorOutputSchema)).toBe(true);
    expect(runFanoFactor(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runFanoFactor({"spikeCounts":[3,3,3]})).toEqual({ok: true, output: {"meanCount":3,"populationVariance":0,"fanoFactor":0}}));
  it("matches independent case 2", () => {
    const result = runFanoFactor({ spikeCounts: [1, 1, 2, 4] });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.meanCount).toBe(2);
      expect(result.output.populationVariance).toBeCloseTo(1.5, 12);
      expect(result.output.fanoFactor).toBeCloseTo(0.75, 12);
    }
  });
  it("reports invalid case 1 at its input field", () => {
    const result = runFanoFactor({"spikeCounts":[0,0]});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "spikeCounts", code: "zero_mean"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runFanoFactor(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
