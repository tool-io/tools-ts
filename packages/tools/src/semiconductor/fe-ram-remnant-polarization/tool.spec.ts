import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFeRamRemnantPolarization, example } from "./tool.js";

describe("semiconductor/fe-ram-remnant-polarization", () => {
  it("matches its worked example", () => {
    expect(calculateFeRamRemnantPolarization(example.input)).toEqual(
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
      tool.execute({ ...example.input, remanentCoulombs: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative remanentCoulombs", () => {
    expect(tool.execute({ ...example.input, remanentCoulombs: -1 }).ok).toBe(
      false,
    );
  });
});
