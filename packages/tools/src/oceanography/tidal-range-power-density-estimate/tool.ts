import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly basinAreaM2: number;
  readonly tidalRangeM: number;
  readonly waterDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly cyclePeriodSeconds: number;
  readonly conversionEfficiencyFraction: number;
}>;
export type Output = Readonly<{
  readonly idealEnergyPerCycleJoules: number;
  readonly modelMeanElectricalPowerWatts: number;
  readonly meanPowerDensityWattsPerM2: number;
}>;
const inputFields = [
  { id: "basinAreaM2", label: "Basin area m2", kind: "number" },
  { id: "tidalRangeM", label: "Tidal range m", kind: "number" },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  { id: "cyclePeriodSeconds", label: "Cycle period seconds", kind: "number" },
  {
    id: "conversionEfficiencyFraction",
    label: "Conversion efficiency fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.basinAreaM2, "basinAreaM2");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.cyclePeriodSeconds, "cyclePeriodSeconds");
  nonnegative(input.tidalRangeM, "tidalRangeM");
  fraction(input.conversionEfficiencyFraction, "conversionEfficiencyFraction");
  const idealEnergyPerCycleJoules =
      (input.waterDensityKgPerM3 *
        input.gravityMPerSecondSquared *
        input.basinAreaM2 *
        input.tidalRangeM ** 2) /
      2,
    modelMeanElectricalPowerWatts =
      (idealEnergyPerCycleJoules / input.cyclePeriodSeconds) *
      input.conversionEfficiencyFraction;
  return {
    idealEnergyPerCycleJoules,
    modelMeanElectricalPowerWatts,
    meanPowerDensityWattsPerM2:
      modelMeanElectricalPowerWatts / input.basinAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  basinAreaM2: 100,
  tidalRangeM: 2,
  waterDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
  cyclePeriodSeconds: 100,
  conversionEfficiencyFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  idealEnergyPerCycleJoules: 2000000,
  modelMeanElectricalPowerWatts: 10000,
  meanPowerDensityWattsPerM2: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/tidal-range-power-density-estimate",
  title: "Tidal Range Power Density Estimate",
  description:
    "Screen ideal single-basin range energy and cycle-averaged electrical output with supplied efficiency; not a tidal-stream kinetic power calculation or plant yield guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealEnergyPerCycleJoules",
      label: "Ideal energy per cycle joules",
      kind: "number",
    },
    {
      id: "modelMeanElectricalPowerWatts",
      label: "Model mean electrical power watts",
      kind: "number",
    },
    {
      id: "meanPowerDensityWattsPerM2",
      label: "Mean power density watts per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      basinAreaM2: value.basinAreaM2 as number,
      tidalRangeM: value.tidalRangeM as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      cyclePeriodSeconds: value.cyclePeriodSeconds as number,
      conversionEfficiencyFraction:
        value.conversionEfficiencyFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
