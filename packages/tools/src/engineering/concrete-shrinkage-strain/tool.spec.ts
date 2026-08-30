import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateConcreteShrinkageStrain, example } from "./tool.js";

describe("engineering/concrete-shrinkage-strain", () => {
  it("matches its worked example", () => {
    expect(calculateConcreteShrinkageStrain(example.input)).toEqual(
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
      tool.execute({ ...example.input, initialLengthMillimeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects an input outside the stated model", () => {
    expect(
      tool.execute({ ...example.input, finalLengthMillimeters: 1001 }).ok,
    ).toBe(false);
  });
});
