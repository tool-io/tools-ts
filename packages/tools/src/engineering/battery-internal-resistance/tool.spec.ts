import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBatteryInternalResistance, example } from "./tool.js";

describe("engineering/battery-internal-resistance", () => {
  it("matches its worked example", () => {
    expect(calculateBatteryInternalResistance(example.input)).toEqual(
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
      tool.execute({ ...example.input, openCircuitVolts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an input outside the stated model", () => {
    expect(tool.execute({ ...example.input, loadedVolts: 13 }).ok).toBe(false);
  });
});
