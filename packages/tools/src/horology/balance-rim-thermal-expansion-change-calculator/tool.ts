import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BalanceThermalExpansionInput = {
  readonly balanceDiameterMillimeters: number;
  readonly linearExpansionCoefficientPerCelsius: number;
  readonly temperatureChangeCelsius: number;
};

export type BalanceThermalExpansionOutput = {
  readonly circumferenceChangeMillimeters: number;
  readonly diameterChangeMillimeters: number;
  readonly finalDiameterMillimeters: number;
  readonly radialChangeMillimeters: number;
};

export const calculateBalanceRimThermalExpansion = (
  input: BalanceThermalExpansionInput,
): BalanceThermalExpansionOutput => {
  if (
    !Number.isFinite(input.balanceDiameterMillimeters) ||
    input.balanceDiameterMillimeters <= 0
  )
    simpleError(
      "balanceDiameterMillimeters",
      "Balance diameter must be finite and positive.",
      "diameter_invalid",
    );
  if (
    !Number.isFinite(input.linearExpansionCoefficientPerCelsius) ||
    input.linearExpansionCoefficientPerCelsius < 0
  )
    simpleError(
      "linearExpansionCoefficientPerCelsius",
      "Expansion coefficient must be finite and nonnegative.",
      "expansion_coefficient_invalid",
    );
  if (!Number.isFinite(input.temperatureChangeCelsius))
    simpleError(
      "temperatureChangeCelsius",
      "Temperature change must be finite.",
      "temperature_change_invalid",
    );
  const diameterChangeMillimeters =
    input.balanceDiameterMillimeters *
    input.linearExpansionCoefficientPerCelsius *
    input.temperatureChangeCelsius;
  const finalDiameterMillimeters =
    input.balanceDiameterMillimeters + diameterChangeMillimeters;
  if (finalDiameterMillimeters <= 0)
    simpleError(
      "temperatureChangeCelsius",
      "The modeled final diameter must remain positive.",
      "nonpositive_final_diameter",
    );
  return {
    circumferenceChangeMillimeters: Math.PI * diameterChangeMillimeters,
    diameterChangeMillimeters,
    finalDiameterMillimeters,
    radialChangeMillimeters: diameterChangeMillimeters / 2,
  };
};

export const balanceThermalExpansionExample = {
  input: {
    balanceDiameterMillimeters: 10,
    linearExpansionCoefficientPerCelsius: 0.0000115,
    temperatureChangeCelsius: 10,
  },
  output: {
    circumferenceChangeMillimeters: 0.003612831551628262,
    diameterChangeMillimeters: 0.00115,
    finalDiameterMillimeters: 10.00115,
    radialChangeMillimeters: 0.000575,
  },
} satisfies ToolExample<
  BalanceThermalExpansionInput,
  BalanceThermalExpansionOutput
>;

export const balanceThermalExpansionTool = createSimpleTool({
  calculate: (input) =>
    calculateBalanceRimThermalExpansion({
      balanceDiameterMillimeters: input.balanceDiameterMillimeters as number,
      linearExpansionCoefficientPerCelsius:
        input.linearExpansionCoefficientPerCelsius as number,
      temperatureChangeCelsius: input.temperatureChangeCelsius as number,
    }),
  description:
    "Calculate linear thermal expansion of a balance rim from its diameter, material coefficient, and signed temperature change.",
  id: "horology/balance-rim-thermal-expansion-change-calculator",
  inputs: [
    {
      id: "balanceDiameterMillimeters",
      kind: "number",
      label: "Balance diameter",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "linearExpansionCoefficientPerCelsius",
      kind: "number",
      label: "Linear expansion coefficient",
      minimum: 0,
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
      id: "circumferenceChangeMillimeters",
      kind: "number",
      label: "Circumference change",
      unit: "mm",
    },
    {
      id: "diameterChangeMillimeters",
      kind: "number",
      label: "Signed diameter change",
      unit: "mm",
    },
    {
      id: "finalDiameterMillimeters",
      kind: "number",
      label: "Final diameter",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "radialChangeMillimeters",
      kind: "number",
      label: "Signed radial change",
      unit: "mm",
    },
  ],
  title: "Balance Rim Thermal Expansion Change Calculator",
});

export const runBalanceThermalExpansion = balanceThermalExpansionTool.execute;
export default balanceThermalExpansionTool;
