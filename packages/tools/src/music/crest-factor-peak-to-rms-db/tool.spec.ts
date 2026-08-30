import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateCrestFactorPeakToRmsDb, example } from "./tool.js";

describe("music/crest-factor-peak-to-rms-db", () => {
  it("matches its worked example", () => {
    expect(calculateCrestFactorPeakToRmsDb(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, peakAmplitude: Number.NaN }).ok,
    ).toBe(false);
  });
});
