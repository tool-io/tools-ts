import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMotorPowerFactorAtLoad, example } from "./tool.js";

describe("electronics/motor-power-factor-at-load", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateMotorPowerFactorAtLoad(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, realPowerW: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      realPowerW: 1000000000,
      lineVoltageV: 400,
      lineCurrentAmperes: 15,
    });
    expect(result).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_value", field: "realPowerW" }] },
    });
  });
});
