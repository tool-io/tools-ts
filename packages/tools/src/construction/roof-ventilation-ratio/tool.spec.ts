import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRoofVentilationRatio, example } from "./tool.js";

describe("construction/roof-ventilation-ratio", () => {
  it("matches its worked example", () => {
    expect(calculateRoofVentilationRatio(example.input)).toEqual(
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
      tool.execute({ ...example.input, atticSquareMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative atticSquareMeters", () => {
    expect(tool.execute({ ...example.input, atticSquareMeters: -1 }).ok).toBe(
      false,
    );
  });
});
