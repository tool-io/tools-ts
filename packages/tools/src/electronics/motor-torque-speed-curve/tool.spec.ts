import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMotorTorqueSpeedCurve, example } from "./tool.js";

describe("electronics/motor-torque-speed-curve", () => {
  it("matches its worked example", () => {
    expect(calculateMotorTorqueSpeedCurve(example.input)).toEqual(
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
      tool.execute({ ...example.input, stallTorqueNewtonMeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects speeds above the ideal no-load speed", () => {
    expect(tool.execute({ ...example.input, speedRpm: 1001 }).ok).toBe(false);
  });
});
