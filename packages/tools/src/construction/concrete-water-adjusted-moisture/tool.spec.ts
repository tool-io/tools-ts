import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateConcreteWaterAdjustedMoisture,
  example,
} from "./tool.js";

describe("construction/concrete-water-adjusted-moisture", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateConcreteWaterAdjustedMoisture(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, targetMixingWaterKg: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      targetMixingWaterKg: 0,
      aggregateOvenDryMassKg: 1000,
      totalMoisturePercent: 3,
      absorptionPercent: 1,
    });
    expect(result).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_value", field: "targetMixingWaterKg" }],
      },
    });
  });
});
