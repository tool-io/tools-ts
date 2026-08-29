import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateConcreteAggregateVolume, example } from "./tool.js";

describe("construction/concrete-aggregate-volume", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateConcreteAggregateVolume(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, targetVolumeCubicMeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      targetVolumeCubicMeters: 0,
      cementMassKg: 315,
      cementDensityKgPerCubicMeter: 3150,
      waterVolumeCubicMeters: 0.18,
      airVolumeCubicMeters: 0.04,
    });
    expect(result).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_value", field: "targetVolumeCubicMeters" }],
      },
    });
  });
});
