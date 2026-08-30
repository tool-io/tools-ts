import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFeRamCoerciveVoltage, example } from "./tool.js";

describe("semiconductor/fe-ram-coercive-voltage", () => {
  it("matches its worked example", () => {
    expect(calculateFeRamCoerciveVoltage(example.input)).toEqual(
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
      tool.execute({ ...example.input, coerciveVoltsPerMeter: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative coerciveVoltsPerMeter", () => {
    expect(
      tool.execute({ ...example.input, coerciveVoltsPerMeter: -1 }).ok,
    ).toBe(false);
  });
});
