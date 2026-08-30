import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateNcoFrequencyResolution, example } from "./tool.js";

describe("electronics/nco-frequency-resolution", () => {
  it("matches its worked example", () => {
    expect(calculateNcoFrequencyResolution(example.input)).toEqual(
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
    expect(tool.execute({ ...example.input, clockHertz: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("requires at least one accumulator bit", () => {
    expect(tool.execute({ ...example.input, accumulatorBits: 0 }).ok).toBe(
      false,
    );
  });
});
