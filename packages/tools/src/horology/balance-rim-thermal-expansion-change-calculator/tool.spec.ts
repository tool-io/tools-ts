import { describe, expect, it } from "vitest";
import {
  balanceThermalExpansionExample,
  calculateBalanceRimThermalExpansion,
  runBalanceThermalExpansion,
} from "./tool.js";

describe("balance rim thermal-expansion calculator", () => {
  it("reproduces the canonical steel example", () => {
    expect(
      runBalanceThermalExpansion(balanceThermalExpansionExample.input),
    ).toEqual({ ok: true, output: balanceThermalExpansionExample.output });
  });

  it("independently calculates steel expansion for a 20°C rise", () => {
    expect(
      calculateBalanceRimThermalExpansion({
        balanceDiameterMillimeters: 10,
        linearExpansionCoefficientPerCelsius: 0.0000115,
        temperatureChangeCelsius: 20,
      }).diameterChangeMillimeters,
    ).toBeCloseTo(0.0023, 12);
  });

  it("preserves the sign for cooling", () => {
    expect(
      calculateBalanceRimThermalExpansion({
        balanceDiameterMillimeters: 10,
        linearExpansionCoefficientPerCelsius: 0.0000115,
        temperatureChangeCelsius: -10,
      }).diameterChangeMillimeters,
    ).toBeCloseTo(-0.00115, 12);
  });

  it("allows a zero-expansion coefficient", () => {
    expect(
      calculateBalanceRimThermalExpansion({
        balanceDiameterMillimeters: 10,
        linearExpansionCoefficientPerCelsius: 0,
        temperatureChangeCelsius: 20,
      }),
    ).toMatchObject({
      diameterChangeMillimeters: 0,
      finalDiameterMillimeters: 10,
    });
  });

  it("rejects contraction beyond the physical diameter", () => {
    expect(
      runBalanceThermalExpansion({
        balanceDiameterMillimeters: 1,
        linearExpansionCoefficientPerCelsius: 0.02,
        temperatureChangeCelsius: -100,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "nonpositive_final_diameter",
            field: "temperatureChangeCelsius",
          },
        ],
      },
      ok: false,
    });
  });
});
