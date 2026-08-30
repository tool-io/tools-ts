import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBatterySeriesVoltage, example } from "./tool.js";

describe("engineering/battery-series-voltage", () => {
  it("matches its worked example", () => {
    expect(calculateBatterySeriesVoltage(example.input)).toEqual(
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
      tool.execute({ ...example.input, cellVoltageVolts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("requires positive integer counts", () => {
    expect(tool.execute({ ...example.input, cellCount: 0 }).ok).toBe(false);
  });
});
