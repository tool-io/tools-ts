import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateInsulationCompressionFactor, example } from "./tool.js";

describe("construction/insulation-compression-factor", () => {
  it("matches its worked example", () => {
    expect(calculateInsulationCompressionFactor(example.input)).toEqual(
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
      tool.execute({ ...example.input, originalMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative originalMillimeters", () => {
    expect(tool.execute({ ...example.input, originalMillimeters: -1 }).ok).toBe(
      false,
    );
  });
});
