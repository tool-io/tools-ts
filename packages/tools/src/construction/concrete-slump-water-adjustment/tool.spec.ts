import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateConcreteSlumpWaterAdjustment,
  example,
} from "./tool.js";

describe("construction/concrete-slump-water-adjustment", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateConcreteSlumpWaterAdjustment(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, trialWaterLiters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      trialWaterLiters: 160,
      trialSlumpMm: 1000000000,
      targetSlumpMm: 100,
      waterLitersPerMm: 0.2,
    });
    expect(result).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_value", field: "targetSlumpMm" }] },
    });
  });
});
