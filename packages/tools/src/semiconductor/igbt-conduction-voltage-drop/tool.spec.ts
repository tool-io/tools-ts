import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateIgbtConductionVoltageDrop, example } from "./tool.js";

describe("semiconductor/igbt-conduction-voltage-drop", () => {
  it("matches its worked example", () => {
    expect(calculateIgbtConductionVoltageDrop(example.input)).toEqual(
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
      tool.execute({ ...example.input, interceptVolts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative interceptVolts", () => {
    expect(tool.execute({ ...example.input, interceptVolts: -1 }).ok).toBe(
      false,
    );
  });
});
