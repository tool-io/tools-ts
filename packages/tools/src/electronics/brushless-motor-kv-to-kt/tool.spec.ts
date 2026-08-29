import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBrushlessMotorKvToKt, example } from "./tool.js";

describe("electronics/brushless-motor-kv-to-kt", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateBrushlessMotorKvToKt(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, speedConstantRpmPerVolt: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{ speedConstantRpmPerVolt: 1e308 },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        result.output.torqueConstantNmPerAmpere / 9.54929658551372e-308,
      ).toBeCloseTo(1, 8);
  });
});
