import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateVoltageSensorDividerRatio, example } from "./tool.js";

describe("electronics/voltage-sensor-divider-ratio", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateVoltageSensorDividerRatio(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, topResistanceOhms: Number.NaN }).ok,
    ).toBe(false);
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{ topResistanceOhms: 1e308, bottomResistanceOhms: 1e308 },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.dividerRatio / 0.5).toBeCloseTo(1, 8);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      topResistanceOhms: 0,
      bottomResistanceOhms: 0,
    });
    expect(result).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_value", field: "bottomResistanceOhms" }],
      },
    });
  });
});
