import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateExpansionFactorPlot, example } from "./tool.js";

describe("forestry/expansion-factor-plot", () => {
  it("matches its worked example", () => {
    expect(calculateExpansionFactorPlot(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("expands a 100 square-metre plot by a factor of 100", () => {
    expect(tool.execute({ plotSquareMeters: 100 })).toEqual({
      ok: true,
      output: { perHectareFactor: 100 },
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, plotSquareMeters: Number.NaN }).ok,
    ).toBe(false);
  });
});
