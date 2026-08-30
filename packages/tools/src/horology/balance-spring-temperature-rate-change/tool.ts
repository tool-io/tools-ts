import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BalanceTemperatureCoefficientInput = {
  readonly balanceInertiaCoefficientPerCelsius: number;
  readonly hairspringStiffnessCoefficientPerCelsius: number;
  readonly temperatureChangeCelsius: number;
};

export type BalanceTemperatureCoefficientOutput = {
  readonly relativePeriodChange: number;
  readonly relativePeriodChangePercent: number;
  readonly relativeRateChangeApproximation: number;
};

export const calculateBalanceSpringTemperatureCoefficient = (
  input: BalanceTemperatureCoefficientInput,
): BalanceTemperatureCoefficientOutput => {
  if (!Number.isFinite(input.hairspringStiffnessCoefficientPerCelsius))
    simpleError(
      "hairspringStiffnessCoefficientPerCelsius",
      "Spring coefficient must be finite.",
      "spring_coefficient_invalid",
    );
  if (!Number.isFinite(input.balanceInertiaCoefficientPerCelsius))
    simpleError(
      "balanceInertiaCoefficientPerCelsius",
      "Inertia coefficient must be finite.",
      "inertia_coefficient_invalid",
    );
  if (!Number.isFinite(input.temperatureChangeCelsius))
    simpleError(
      "temperatureChangeCelsius",
      "Temperature change must be finite.",
      "temperature_change_invalid",
    );
  const relativePeriodChangePerDegree =
    0.5 *
    (input.balanceInertiaCoefficientPerCelsius -
      input.hairspringStiffnessCoefficientPerCelsius);
  const relativePeriodChange =
    relativePeriodChangePerDegree * input.temperatureChangeCelsius;
  return {
    relativePeriodChange,
    relativePeriodChangePercent: 100 * relativePeriodChange,
    relativeRateChangeApproximation: -relativePeriodChange,
  };
};

export const balanceTemperatureCoefficientExample = {
  input: {
    balanceInertiaCoefficientPerCelsius: 0.00002,
    hairspringStiffnessCoefficientPerCelsius: -0.00004,
    temperatureChangeCelsius: 10,
  },
  output: {
    relativePeriodChange: 0.00030000000000000003,
    relativePeriodChangePercent: 0.030000000000000002,
    relativeRateChangeApproximation: -0.00030000000000000003,
  },
} satisfies ToolExample<
  BalanceTemperatureCoefficientInput,
  BalanceTemperatureCoefficientOutput
>;

export const balanceTemperatureCoefficientTool = createSimpleTool({
  calculate: (input) =>
    calculateBalanceSpringTemperatureCoefficient({
      balanceInertiaCoefficientPerCelsius:
        input.balanceInertiaCoefficientPerCelsius as number,
      hairspringStiffnessCoefficientPerCelsius:
        input.hairspringStiffnessCoefficientPerCelsius as number,
      temperatureChangeCelsius: input.temperatureChangeCelsius as number,
    }),
  description:
    "Estimate relative period and rate change from T proportional to the square root of balance inertia divided by hairspring stiffness, using caller-supplied first-order coefficients.",
  id: "horology/balance-spring-temperature-rate-change",
  inputs: [
    {
      id: "balanceInertiaCoefficientPerCelsius",
      kind: "number",
      label: "Balance inertia coefficient",
      unit: "1/degC",
    },
    {
      id: "hairspringStiffnessCoefficientPerCelsius",
      kind: "number",
      label: "Hairspring stiffness coefficient",
      unit: "1/degC",
    },
    {
      id: "temperatureChangeCelsius",
      kind: "number",
      label: "Temperature change",
      unit: "degC",
    },
  ],
  outputs: [
    {
      id: "relativePeriodChange",
      kind: "number",
      label: "First-order relative period change",
    },
    {
      id: "relativePeriodChangePercent",
      kind: "number",
      label: "First-order relative period change",
      unit: "%",
    },
    {
      id: "relativeRateChangeApproximation",
      kind: "number",
      label: "First-order relative rate-change approximation",
    },
  ],
  title: "Balance–Spring Temperature Rate Change",
});

export const runBalanceTemperatureCoefficient =
  balanceTemperatureCoefficientTool.execute;
export default balanceTemperatureCoefficientTool;
