import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runCrystalAgingPpm, crystalAgingPpmTool, crystalAgingPpmInputSchema, crystalAgingPpmOutputSchema } from "./index.js";
describe("Crystal Aging Frequency Change", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(crystalAgingPpmTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, crystalAgingPpmInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, crystalAgingPpmOutputSchema)).toBe(true);
    expect(runCrystalAgingPpm(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runCrystalAgingPpm({"initialFrequencyHz":1000000,"agedFrequencyHz":999995})).toEqual({ok: true, output: {"agingPpm":-5}}));
  it("matches independent case 2", () => expect(runCrystalAgingPpm({"initialFrequencyHz":12000000,"agedFrequencyHz":12000000})).toEqual({ok: true, output: {"agingPpm":0}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runCrystalAgingPpm({"initialFrequencyHz":0,"agedFrequencyHz":1});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "initialFrequencyHz", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runCrystalAgingPpm(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
