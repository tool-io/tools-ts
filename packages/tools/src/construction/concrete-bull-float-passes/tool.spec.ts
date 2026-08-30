import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateConcreteBullFloatPasses, example } from "./tool.js";

describe("construction/concrete-bull-float-passes", () => {
  it("matches its worked example", () => {
    expect(calculateConcreteBullFloatPasses(example.input)).toEqual(
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
      tool.execute({ ...example.input, slabWidthMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative slabWidthMeters", () => {
    expect(tool.execute({ ...example.input, slabWidthMeters: -1 }).ok).toBe(
      false,
    );
  });
});
