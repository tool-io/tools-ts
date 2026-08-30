import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateChopperAmplifierOffset, example } from "./tool.js";

describe("electronics/chopper-amplifier-offset", () => {
  it("matches its worked example", () => {
    expect(calculateChopperAmplifierOffset(example.input)).toEqual(
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
      tool.execute({ ...example.input, outputOffsetMillivolts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative closedLoopGain", () => {
    expect(tool.execute({ ...example.input, closedLoopGain: -1 }).ok).toBe(
      false,
    );
  });
});
