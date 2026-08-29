import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateHeatsinkJunctionToCaseResistance,
  example,
} from "./tool.js";

describe("electronics/heatsink-junction-to-case-resistance", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateHeatsinkJunctionToCaseResistance(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, junctionTemperatureCelsius: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      junctionTemperatureCelsius: -1,
      caseTemperatureCelsius: 65,
      dissipatedPowerW: 10,
    });
    expect(result).toMatchObject({
      ok: false,
      error: {
        issues: [
          { code: "invalid_value", field: "junctionTemperatureCelsius" },
        ],
      },
    });
  });
});
