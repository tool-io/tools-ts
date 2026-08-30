import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateConcreteFormworkPressure, example } from "./tool.js";

describe("construction/concrete-formwork-pressure", () => {
  it("matches its worked example", () => {
    expect(calculateConcreteFormworkPressure(example.input)).toEqual(
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
      tool.execute({ ...example.input, freshDensityKgPerM3: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative freshDensityKgPerM3", () => {
    expect(tool.execute({ ...example.input, freshDensityKgPerM3: -1 }).ok).toBe(
      false,
    );
  });
});
