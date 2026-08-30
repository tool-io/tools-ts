import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly sourceMassFluxKgPerSecond: number;
  readonly sourceTemperatureK: number;
  readonly ambientTemperatureK: number;
  readonly sourceSpecificHeatJPerKgK: number;
  readonly ambientSpecificHeatJPerKgK: number;
  readonly ambientDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly thermalExcessPowerWatts: number;
  readonly thermalBuoyancyFluxM4PerSecondCubed: number;
}>;
const inputFields = [
  {
    id: "sourceMassFluxKgPerSecond",
    label: "Source mass flux kg per second",
    kind: "number",
  },
  { id: "sourceTemperatureK", label: "Source temperature k", kind: "number" },
  { id: "ambientTemperatureK", label: "Ambient temperature k", kind: "number" },
  {
    id: "sourceSpecificHeatJPerKgK",
    label: "Source specific heat j per kg k",
    kind: "number",
  },
  {
    id: "ambientSpecificHeatJPerKgK",
    label: "Ambient specific heat j per kg k",
    kind: "number",
  },
  {
    id: "ambientDensityKgPerM3",
    label: "Ambient density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.sourceTemperatureK, "sourceTemperatureK");
  positive(input.ambientTemperatureK, "ambientTemperatureK");
  positive(input.sourceSpecificHeatJPerKgK, "sourceSpecificHeatJPerKgK");
  positive(input.ambientSpecificHeatJPerKgK, "ambientSpecificHeatJPerKgK");
  positive(input.ambientDensityKgPerM3, "ambientDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  nonnegative(input.sourceMassFluxKgPerSecond, "sourceMassFluxKgPerSecond");
  const thermalExcessPowerWatts =
    input.sourceMassFluxKgPerSecond *
    input.sourceSpecificHeatJPerKgK *
    (input.sourceTemperatureK - input.ambientTemperatureK);
  return {
    thermalExcessPowerWatts,
    thermalBuoyancyFluxM4PerSecondCubed:
      (input.gravityMPerSecondSquared * thermalExcessPowerWatts) /
      (input.ambientDensityKgPerM3 *
        input.ambientSpecificHeatJPerKgK *
        input.ambientTemperatureK),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceMassFluxKgPerSecond: 100,
  sourceTemperatureK: 600,
  ambientTemperatureK: 300,
  sourceSpecificHeatJPerKgK: 1000,
  ambientSpecificHeatJPerKgK: 1000,
  ambientDensityKgPerM3: 1,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  thermalExcessPowerWatts: 30000000,
  thermalBuoyancyFluxM4PerSecondCubed: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/plume-mass-flux-buoyancy-estimate",
  title: "Plume Mass Flux Buoyancy Estimate",
  description:
    "Estimate signed heat-derived plume buoyancy flux using supplied source/ambient heat properties; neglects particle loading, moisture and momentum, retaining negatively buoyant thermal scenarios.",
  inputs: inputFields,
  outputs: [
    {
      id: "thermalExcessPowerWatts",
      label: "Thermal excess power watts",
      kind: "number",
    },
    {
      id: "thermalBuoyancyFluxM4PerSecondCubed",
      label: "Thermal buoyancy flux m4 per second cubed",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sourceMassFluxKgPerSecond: value.sourceMassFluxKgPerSecond as number,
      sourceTemperatureK: value.sourceTemperatureK as number,
      ambientTemperatureK: value.ambientTemperatureK as number,
      sourceSpecificHeatJPerKgK: value.sourceSpecificHeatJPerKgK as number,
      ambientSpecificHeatJPerKgK: value.ambientSpecificHeatJPerKgK as number,
      ambientDensityKgPerM3: value.ambientDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
