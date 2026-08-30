import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSchrankTuerSpaltmass3mm, example } from "./tool.js";

describe("carpentry/schrank-tuer-spaltmass-3mm", () => {
  it("matches its worked example", () => {
    expect(calculateSchrankTuerSpaltmass3mm(example.input)).toEqual(
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
      tool.execute({ ...example.input, measuredGapMm: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative measuredGapMm", () => {
    expect(tool.execute({ ...example.input, measuredGapMm: -1 }).ok).toBe(
      false,
    );
  });
});
