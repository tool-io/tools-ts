import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateIgbtSwitchingEnergyEoff, example } from "./tool.js";

describe("semiconductor/igbt-switching-energy-eoff", () => {
  it("matches its worked example", () => {
    expect(calculateIgbtSwitchingEnergyEoff(example.input)).toEqual(
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
      tool.execute({ ...example.input, blockingVolts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative blockingVolts", () => {
    expect(tool.execute({ ...example.input, blockingVolts: -1 }).ok).toBe(
      false,
    );
  });
});
