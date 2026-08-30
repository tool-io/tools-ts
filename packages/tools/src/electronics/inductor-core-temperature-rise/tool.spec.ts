import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateInductorCoreTemperatureRise, example } from "./tool.js";

describe("electronics/inductor-core-temperature-rise", () => {
  it("matches its worked example", () => {
    expect(calculateInductorCoreTemperatureRise(example.input)).toEqual(
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
      tool.execute({ ...example.input, coreLossWatts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative coreLossWatts", () => {
    expect(tool.execute({ ...example.input, coreLossWatts: -1 }).ok).toBe(
      false,
    );
  });
});
