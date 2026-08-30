import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMortarJointThicknessAverage, example } from "./tool.js";

describe("construction/mortar-joint-thickness-average", () => {
  it("matches its worked example", () => {
    expect(calculateMortarJointThicknessAverage(example.input)).toEqual(
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
      tool.execute({ ...example.input, summedMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative summedMillimeters", () => {
    expect(tool.execute({ ...example.input, summedMillimeters: -1 }).ok).toBe(
      false,
    );
  });
});
