import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMotorSlipPercentage, example } from "./tool.js";

describe("electronics/motor-slip-percentage", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateMotorSlipPercentage(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, synchronousSpeedRpm: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      synchronousSpeedRpm: 5e-324,
      rotorSpeedRpm: 1440,
    });
    expect(result).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_value", field: "rotorSpeedRpm" }] },
    });
  });
});
