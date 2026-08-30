import { describe, expect, it } from "vitest";
import {
  balanceTemperatureCoefficientExample,
  calculateBalanceSpringTemperatureCoefficient,
  runBalanceTemperatureCoefficient,
} from "./tool.js";

describe("balance-spring temperature rate change", () => {
  it("reproduces the canonical first-order compensation example", () => {
    expect(
      runBalanceTemperatureCoefficient(
        balanceTemperatureCoefficientExample.input,
      ),
    ).toEqual({
      ok: true,
      output: balanceTemperatureCoefficientExample.output,
    });
  });

  it("returns zero period change for equal coefficients", () => {
    expect(
      calculateBalanceSpringTemperatureCoefficient({
        hairspringStiffnessCoefficientPerCelsius: 0.00001,
        balanceInertiaCoefficientPerCelsius: 0.00001,
        temperatureChangeCelsius: 20,
      }).relativePeriodChange,
    ).toBe(0);
  });

  it("uses the derivative of T proportional to sqrt(I divided by stiffness)", () => {
    expect(
      calculateBalanceSpringTemperatureCoefficient({
        hairspringStiffnessCoefficientPerCelsius: -0.00004,
        balanceInertiaCoefficientPerCelsius: 0.00002,
        temperatureChangeCelsius: -10,
      }).relativePeriodChange,
    ).toBe(-0.00030000000000000003);
  });

  it("negates period change for the first-order rate approximation", () => {
    const result = calculateBalanceSpringTemperatureCoefficient({
      hairspringStiffnessCoefficientPerCelsius: 0.0001,
      balanceInertiaCoefficientPerCelsius: 0,
      temperatureChangeCelsius: 1,
    });
    expect(result.relativeRateChangeApproximation).toBe(
      -result.relativePeriodChange,
    );
  });

  it("rejects a nonfinite spring coefficient", () => {
    expect(
      runBalanceTemperatureCoefficient({
        hairspringStiffnessCoefficientPerCelsius: Number.NaN,
        balanceInertiaCoefficientPerCelsius: 0,
        temperatureChangeCelsius: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "hairspringStiffnessCoefficientPerCelsius",
          },
        ],
      },
      ok: false,
    });
  });
});
