import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePaSaturatedPower, example } from "./tool.js";

describe("electronics/pa-saturated-power", () => {
  it("matches its worked example", () => {
    expect(calculatePaSaturatedPower(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, saturatedRmsVolts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative saturatedRmsVolts", () => {
    expect(tool.execute({ ...example.input, saturatedRmsVolts: -1 }).ok).toBe(
      false,
    );
  });
});
