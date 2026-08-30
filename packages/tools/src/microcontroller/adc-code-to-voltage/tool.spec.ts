import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateAdcCodeToVoltage, example } from "./tool.js";

describe("microcontroller/adc-code-to-voltage", () => {
  it("matches its worked example", () => {
    expect(calculateAdcCodeToVoltage(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, code: Number.NaN }).ok).toBe(false);
  });
  it("rejects a negative code", () => {
    expect(tool.execute({ ...example.input, code: -1 }).ok).toBe(false);
  });
});
