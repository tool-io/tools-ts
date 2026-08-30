import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRationalMethodPeakFlow, example } from "./tool.js";

describe("engineering/rational-method-peak-flow", () => {
  it("matches its worked example", () => {
    expect(calculateRationalMethodPeakFlow(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("converts mm/h over hectares to cubic metres per second", () => {
    expect(
      tool.execute({
        runoffCoefficient: 0.7,
        rainfallMillimetersPerHour: 50,
        areaHectares: 2,
      }),
    ).toEqual({
      ok: true,
      output: { peakCubicMetersPerSecond: 70 / 360 },
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, runoffCoefficient: Number.NaN }).ok,
    ).toBe(false);
  });
});
