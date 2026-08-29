import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePtcThermistorResistance, example } from "./tool.js";

describe("electronics/ptc-thermistor-resistance", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculatePtcThermistorResistance(example.input)).toEqual(
      example.output,
    );
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
      referenceResistanceOhms: 1000,
      temperatureCoefficientPerCelsius: -1,
      temperatureCelsius: 50,
      referenceTemperatureCelsius: 25,
    });
    expect(result).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_value", field: "temperatureCelsius" }],
      },
    });
  });
});
