import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateAwgDiameter, example } from "./tool.js";

describe("engineering/awg-diameter", () => {
  it("matches its worked example", () => {
    expect(calculateAwgDiameter(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, awg: Number.NaN }).ok).toBe(false);
  });
  it("supports 4/0 AWG and rejects gauges outside the standard range", () => {
    expect(
      calculateAwgDiameter({ awg: -3 }).diameterMillimeters,
    ).toBeGreaterThan(11);
    expect(tool.execute({ awg: -4 }).ok).toBe(false);
    expect(tool.execute({ awg: 41 }).ok).toBe(false);
  });
});
