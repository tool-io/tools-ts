import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateFrequencySynthesizerStepSize,
  example,
} from "./tool.js";

describe("electronics/frequency-synthesizer-step-size", () => {
  it("matches its worked example", () => {
    expect(calculateFrequencySynthesizerStepSize(example.input)).toEqual(
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
      tool.execute({ ...example.input, referenceHertz: Number.NaN }).ok,
    ).toBe(false);
  });
  it("requires an integer reference divider", () => {
    expect(tool.execute({ ...example.input, referenceDivider: 1.5 }).ok).toBe(
      false,
    );
  });
});
