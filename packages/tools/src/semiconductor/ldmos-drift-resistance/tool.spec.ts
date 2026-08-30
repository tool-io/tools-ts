import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLdmosDriftResistance, example } from "./tool.js";

describe("semiconductor/ldmos-drift-resistance", () => {
  it("matches its worked example", () => {
    expect(calculateLdmosDriftResistance(example.input)).toEqual(
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
      tool.execute({ ...example.input, resistivityOhmMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative resistivityOhmMeters", () => {
    expect(
      tool.execute({ ...example.input, resistivityOhmMeters: -1 }).ok,
    ).toBe(false);
  });
});
