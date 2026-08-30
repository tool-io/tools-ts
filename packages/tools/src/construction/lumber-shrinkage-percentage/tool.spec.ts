import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLumberShrinkagePercentage, example } from "./tool.js";

describe("construction/lumber-shrinkage-percentage", () => {
  it("matches its worked example", () => {
    expect(calculateLumberShrinkagePercentage(example.input)).toEqual(
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
      tool.execute({ ...example.input, initialMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative initialMillimeters", () => {
    expect(tool.execute({ ...example.input, initialMillimeters: -1 }).ok).toBe(
      false,
    );
  });
});
