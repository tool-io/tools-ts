import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly incidentPowerWatts: number;
  readonly absorbedFraction: number;
  readonly heatingSeconds: number;
  readonly sampleMassGrams: number;
  readonly specificHeatJPerGramK: number;
}>;
export type Output = Readonly<{
  readonly absorbedEnergyJoules: number;
  readonly adiabaticTemperatureRiseKelvin: number;
}>;

export const calculate = (input: Input): Output => {
  const heatCapacity = input.sampleMassGrams * input.specificHeatJPerGramK;
  if (heatCapacity <= 0)
    simpleError(
      "sampleMassGrams",
      "Mass and specific heat must produce positive heat capacity.",
      "invalid_heat_capacity",
    );
  const absorbedEnergyJoules =
    input.incidentPowerWatts * input.absorbedFraction * input.heatingSeconds;
  return {
    absorbedEnergyJoules,
    adiabaticTemperatureRiseKelvin: absorbedEnergyJoules / heatCapacity,
  };
};

export const exampleInput = {
  incidentPowerWatts: 1,
  absorbedFraction: 0.5,
  heatingSeconds: 2,
  sampleMassGrams: 1,
  specificHeatJPerGramK: 4,
} satisfies Input;
export const exampleOutput = {
  absorbedEnergyJoules: 1,
  adiabaticTemperatureRiseKelvin: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      incidentPowerWatts: input.incidentPowerWatts as number,
      absorbedFraction: input.absorbedFraction as number,
      heatingSeconds: input.heatingSeconds as number,
      sampleMassGrams: input.sampleMassGrams as number,
      specificHeatJPerGramK: input.specificHeatJPerGramK as number,
    }),
  description:
    "Estimate adiabatic sample heating from absorbed nanorod illumination.",
  id: "laser/nanorod-heating-estimate",
  inputs: [
    {
      id: "incidentPowerWatts",
      label: "Incident optical power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "absorbedFraction",
      label: "Absorbed power fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "heatingSeconds",
      label: "Heating duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "sampleMassGrams",
      label: "Heated sample mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      id: "specificHeatJPerGramK",
      label: "Sample specific heat",
      kind: "number",
      minimum: 0,
      unit: "J/(g·K)",
    },
  ],
  outputs: [
    {
      id: "absorbedEnergyJoules",
      label: "Absorbed energy",
      kind: "number",
      minimum: 0,
      unit: "J",
    },
    {
      id: "adiabaticTemperatureRiseKelvin",
      label: "Adiabatic temperature rise",
      kind: "number",
      minimum: 0,
      unit: "K",
    },
  ],
  title: "Nanorod Heating Estimate",
});

export const run = tool.execute;
export default tool;
