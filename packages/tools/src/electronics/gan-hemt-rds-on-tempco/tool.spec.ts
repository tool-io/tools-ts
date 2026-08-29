import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateGanHemtRdsOnTempco, example } from "./tool.js";

describe("electronics/gan-hemt-rds-on-tempco", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateGanHemtRdsOnTempco(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, referenceResistanceOhms: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      referenceResistanceOhms: 0.02,
      hotResistanceOhms: 0.026,
      referenceTemperatureCelsius: 1000000000,
      hotTemperatureCelsius: 125,
    });
    expect(result).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_value", field: "hotTemperatureCelsius" }],
      },
    });
  });
});
