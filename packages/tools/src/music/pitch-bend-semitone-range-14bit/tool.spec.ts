import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePitchBendSemitoneRange14bit, example } from "./tool.js";

describe("music/pitch-bend-semitone-range-14bit", () => {
  it("matches its worked example", () => {
    expect(calculatePitchBendSemitoneRange14bit(example.input)).toEqual(
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
    expect(tool.execute({ ...example.input, bendValue: Number.NaN }).ok).toBe(
      false,
    );
  });
});
