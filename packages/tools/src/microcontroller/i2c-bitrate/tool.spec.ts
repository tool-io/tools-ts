import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateI2cBitrate, example } from "./tool.js";

describe("microcontroller/i2c-bitrate", () => {
  it("matches its worked example", () => {
    expect(calculateI2cBitrate(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, highSeconds: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative highSeconds", () => {
    expect(tool.execute({ ...example.input, highSeconds: -1 }).ok).toBe(false);
  });
});
