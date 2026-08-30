import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateAbsorptionRequiredForTargetRt,
  example,
} from "./tool.js";

describe("acoustics/absorption-required-for-target-rt", () => {
  it("matches its worked example", () => {
    expect(calculateAbsorptionRequiredForTargetRt(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("uses the metric Sabine relation", () => {
    expect(
      tool.execute({ roomCubicMeters: 100, targetRt60Seconds: 0.805 }),
    ).toEqual({ ok: true, output: { absorptionSabins: 20 } });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, roomCubicMeters: Number.NaN }).ok,
    ).toBe(false);
  });
});
