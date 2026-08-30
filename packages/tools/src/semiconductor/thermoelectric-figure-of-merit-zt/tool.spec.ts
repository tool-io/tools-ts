import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateThermoelectricFigureOfMeritZt,
  example,
} from "./tool.js";

describe("semiconductor/thermoelectric-figure-of-merit-zt", () => {
  it("matches its worked example", () => {
    expect(calculateThermoelectricFigureOfMeritZt(example.input)).toEqual(
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
      tool.execute({ ...example.input, seebeckVoltsPerKelvin: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative electricalSiemensPerMeter", () => {
    expect(
      tool.execute({ ...example.input, electricalSiemensPerMeter: -1 }).ok,
    ).toBe(false);
  });
});
