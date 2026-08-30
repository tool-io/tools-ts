import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePcmAmorphizationEnergy, example } from "./tool.js";

describe("semiconductor/pcm-amorphization-energy", () => {
  it("matches its worked example", () => {
    expect(calculatePcmAmorphizationEnergy(example.input)).toEqual(
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
    expect(tool.execute({ ...example.input, pulseWatts: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative pulseWatts", () => {
    expect(tool.execute({ ...example.input, pulseWatts: -1 }).ok).toBe(false);
  });
});
