import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLumberDefectPercentage, example } from "./tool.js";

describe("construction/lumber-defect-percentage", () => {
  it("matches its worked example", () => {
    expect(calculateLumberDefectPercentage(example.input)).toEqual(
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
      tool.execute({ ...example.input, defectMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative defectMillimeters", () => {
    expect(tool.execute({ ...example.input, defectMillimeters: -1 }).ok).toBe(
      false,
    );
  });
});
