import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateBatterySelfDischargePerMonth,
  example,
} from "./tool.js";

describe("electronics/battery-self-discharge-per-month", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateBatterySelfDischargePerMonth(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, initialChargeAh: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({ initialChargeAh: 5e-324, finalChargeAh: 48 });
    expect(result).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_value", field: "finalChargeAh" }] },
    });
  });
});
