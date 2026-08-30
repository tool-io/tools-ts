import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeatEnergySpecificHeatInput = Readonly<{
  readonly massKilograms: number;
  readonly specificJoulesPerKgKelvin: number;
  readonly temperatureChangeKelvin: number;
}>;
export type HeatEnergySpecificHeatOutput = Readonly<{
  readonly heatJoules: number;
}>;

export const calculateHeatEnergySpecificHeat = (
  x: HeatEnergySpecificHeatInput,
): HeatEnergySpecificHeatOutput => {
  if (!Number.isFinite(x.massKilograms) || x.massKilograms < 0)
    simpleError("massKilograms", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.specificJoulesPerKgKelvin) ||
    x.specificJoulesPerKgKelvin < 0
  )
    simpleError(
      "specificJoulesPerKgKelvin",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.temperatureChangeKelvin))
    simpleError("temperatureChangeKelvin", "Provide a finite number.");
  const heatJoules =
    x.massKilograms * x.specificJoulesPerKgKelvin * x.temperatureChangeKelvin;
  if (!Number.isFinite(heatJoules))
    simpleError(
      "heatJoules",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { heatJoules: Object.is(heatJoules, -0) ? 0 : heatJoules };
};

export const example = {
  input: {
    massKilograms: 2,
    specificJoulesPerKgKelvin: 4000,
    temperatureChangeKelvin: 10,
  },
  output: { heatJoules: 80000 },
} satisfies ToolExample<
  HeatEnergySpecificHeatInput,
  HeatEnergySpecificHeatOutput
>;

export const tool = createSimpleTool({
  id: "engineering/heat-energy-specific-heat",
  title: "Heat Energy Specific Heat",
  description:
    "Sensible heat required for a mass with constant specific heat capacity over the chosen temperature interval.",
  inputs: [
    {
      id: "massKilograms",
      kind: "number",
      label: "Mass Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "specificJoulesPerKgKelvin",
      kind: "number",
      label: "Specific Joules Per Kg Kelvin",
      unit: "J/(kg·K)",
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
    { id: "heatJoules", kind: "number", label: "Heat Joules", unit: "J" },
  ],
  calculate: (input) =>
    calculateHeatEnergySpecificHeat({
      massKilograms: input.massKilograms as number,
      specificJoulesPerKgKelvin: input.specificJoulesPerKgKelvin as number,
      temperatureChangeKelvin: input.temperatureChangeKelvin as number,
    }),
});
export const heatEnergySpecificHeatTool = tool;
export const runHeatEnergySpecificHeat = tool.execute;
export default tool;
