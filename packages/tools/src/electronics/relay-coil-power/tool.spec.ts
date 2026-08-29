import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRelayCoilPower, example } from "./tool.js";

describe("electronics/relay-coil-power", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateRelayCoilPower(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, coilVoltageV: Number.NaN }).ok,
    ).toBe(false);
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{ coilVoltageV: 1e200, coilResistanceOhms: 1e200 },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.coilPowerW / 1e200).toBeCloseTo(1, 8);
  });
  it("does not lose a representable result to intermediate underflow", () => {
    const result = tool.execute({
      ...example.input,
      ...{ coilVoltageV: 1e-200, coilResistanceOhms: 1e-300 },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.coilPowerW / 1e-100).toBeCloseTo(1, 8);
  });
});
