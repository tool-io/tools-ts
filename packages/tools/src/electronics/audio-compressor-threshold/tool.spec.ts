import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateAudioCompressorThreshold, example } from "./tool.js";

describe("electronics/audio-compressor-threshold", () => {
  it("matches its worked example", () => {
    expect(calculateAudioCompressorThreshold(example.input)).toEqual(
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
    expect(tool.execute({ ...example.input, inputDb: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative compressionRatio", () => {
    expect(tool.execute({ ...example.input, compressionRatio: -1 }).ok).toBe(
      false,
    );
  });
});
