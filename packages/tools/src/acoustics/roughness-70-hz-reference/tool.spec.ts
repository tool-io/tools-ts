import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { example, lookupRoughness70HzModulationMaximum } from "./tool.js";

describe("acoustics/roughness-70-hz-reference", () => {
  it("matches its canonical example", () => {
    expect(lookupRoughness70HzModulationMaximum()).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });

  it("keeps the 1-asp reference distinct from a universal peak", () => {
    expect(example.output).toMatchObject({
      asperCarrierHertz: 1000,
      asperLevelDecibels: 60,
      asperModulationDepth: 1,
      peakModulationHertz: 70,
      universalPeak: false,
    });
    expect(example.output.evidenceScope).toContain("not a universal");
  });

  it("rejects missing, malformed, and unknown inputs", () => {
    expect(tool.execute(null).ok).toBe(false);
    expect(tool.execute({ carrierHertz: 1000 }).ok).toBe(false);
  });
});
