import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateAngularFrequencyCalculator, example } from "./tool.js";

describe("acoustics/angular-frequency-calculator", () => {
  it("matches its worked example", () => {
    expect(calculateAngularFrequencyCalculator(example.input)).toEqual(
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
      tool.execute({ ...example.input, frequencyHertz: Number.NaN }).ok,
    ).toBe(false);
  });
});
