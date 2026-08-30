import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePwmDutyCount, example } from "./tool.js";

describe("microcontroller/pwm-duty-count", () => {
  it("matches its worked example", () => {
    expect(calculatePwmDutyCount(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, dutyFraction: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative dutyFraction", () => {
    expect(tool.execute({ ...example.input, dutyFraction: -1 }).ok).toBe(false);
  });
});
