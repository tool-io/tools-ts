import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermalExpansionLinearInput = Readonly<{
  readonly coefficientPerKelvin: number;
  readonly initialMeters: number;
  readonly temperatureChangeKelvin: number;
}>;
export type ThermalExpansionLinearOutput = Readonly<{
  readonly lengthChangeMeters: number;
}>;

export const calculateThermalExpansionLinear = (
  x: ThermalExpansionLinearInput,
): ThermalExpansionLinearOutput => {
  if (!Number.isFinite(x.coefficientPerKelvin))
    simpleError("coefficientPerKelvin", "Provide a finite number.");
  if (!Number.isFinite(x.initialMeters) || x.initialMeters < 0)
    simpleError("initialMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.temperatureChangeKelvin))
    simpleError("temperatureChangeKelvin", "Provide a finite number.");
  const lengthChangeMeters =
    x.coefficientPerKelvin * x.initialMeters * x.temperatureChangeKelvin;
  if (!Number.isFinite(lengthChangeMeters))
    simpleError(
      "lengthChangeMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    lengthChangeMeters: Object.is(lengthChangeMeters, -0)
      ? 0
      : lengthChangeMeters,
  };
};

export const example = {
  input: {
    coefficientPerKelvin: 0.00001,
    initialMeters: 2,
    temperatureChangeKelvin: 10,
  },
  output: { lengthChangeMeters: 0.0002 },
} satisfies ToolExample<
  ThermalExpansionLinearInput,
  ThermalExpansionLinearOutput
>;

export const tool = createSimpleTool({
  id: "engineering/thermal-expansion-linear",
  title: "Thermal Expansion Linear",
  description:
    "Free linear thermal length change αLΔT using a constant expansion coefficient over the chosen temperature interval.",
  inputs: [
    {
      id: "coefficientPerKelvin",
      kind: "number",
      label: "Coefficient Per Kelvin",
      unit: "1/K",
    },
    {
      id: "initialMeters",
      kind: "number",
      label: "Initial Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "temperatureChangeKelvin",
      kind: "number",
      label: "Temperature Change Kelvin",
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "lengthChangeMeters",
      kind: "number",
      label: "Length Change Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateThermalExpansionLinear({
      coefficientPerKelvin: input.coefficientPerKelvin as number,
      initialMeters: input.initialMeters as number,
      temperatureChangeKelvin: input.temperatureChangeKelvin as number,
    }),
});
export const thermalExpansionLinearTool = tool;
export const runThermalExpansionLinear = tool.execute;
export default tool;
