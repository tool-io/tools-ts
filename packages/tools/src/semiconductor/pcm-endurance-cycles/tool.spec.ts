import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePcmEnduranceCycles, example } from "./tool.js";

describe("semiconductor/pcm-endurance-cycles", () => {
  it("matches its worked example", () => {
    expect(calculatePcmEnduranceCycles(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, ratedCycles: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative ratedCycles", () => {
    expect(tool.execute({ ...example.input, ratedCycles: -1 }).ok).toBe(false);
  });
});
