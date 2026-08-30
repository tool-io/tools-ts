import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateExcavationSlopeRatio, example } from "./tool.js";

describe("construction/excavation-slope-ratio", () => {
  it("matches its worked example", () => {
    expect(calculateExcavationSlopeRatio(example.input)).toEqual(
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
      tool.execute({ ...example.input, horizontalRunMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative horizontalRunMeters", () => {
    expect(tool.execute({ ...example.input, horizontalRunMeters: -1 }).ok).toBe(
      false,
    );
  });
});
