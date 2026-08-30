import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePaintTintRatio, example } from "./tool.js";

describe("construction/paint-tint-ratio", () => {
  it("matches its worked example", () => {
    expect(calculatePaintTintRatio(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, totalLiters: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative totalLiters", () => {
    expect(tool.execute({ ...example.input, totalLiters: -1 }).ok).toBe(false);
  });
});
