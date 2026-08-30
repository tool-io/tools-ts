import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateConcreteCuringWaterNeeded, example } from "./tool.js";

describe("construction/concrete-curing-water-needed", () => {
  it("matches its worked example", () => {
    expect(calculateConcreteCuringWaterNeeded(example.input)).toEqual(
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
      tool.execute({ ...example.input, exposedSquareMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative exposedSquareMeters", () => {
    expect(tool.execute({ ...example.input, exposedSquareMeters: -1 }).ok).toBe(
      false,
    );
  });
});
