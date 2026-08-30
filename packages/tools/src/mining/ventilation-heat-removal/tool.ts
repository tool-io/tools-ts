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
  readonly sensibleHeatKw: number;
  readonly airDensityKgPerM3: number;
  readonly airSpecificHeatKjPerKgK: number;
  readonly permittedTemperatureRiseK: number;
  readonly heatCaptureFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredAirQuantityM3PerSecond: number;
}>;
const inputFields = [
  { id: "sensibleHeatKw", label: "Sensible heat kw", kind: "number" },
  { id: "airDensityKgPerM3", label: "Air density kg per m3", kind: "number" },
  {
    id: "airSpecificHeatKjPerKgK",
    label: "Air specific heat kj per kg k",
    kind: "number",
  },
  {
    id: "permittedTemperatureRiseK",
    label: "Permitted temperature rise k",
    kind: "number",
  },
  { id: "heatCaptureFraction", label: "Heat capture fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.airDensityKgPerM3, "airDensityKgPerM3");
  positive(input.airSpecificHeatKjPerKgK, "airSpecificHeatKjPerKgK");
  positive(input.permittedTemperatureRiseK, "permittedTemperatureRiseK");
  nonnegative(input.sensibleHeatKw, "sensibleHeatKw");
  fraction(input.heatCaptureFraction, "heatCaptureFraction");
  return {
    requiredAirQuantityM3PerSecond:
      (input.sensibleHeatKw * input.heatCaptureFraction) /
      (input.airDensityKgPerM3 *
        input.airSpecificHeatKjPerKgK *
        input.permittedTemperatureRiseK),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sensibleHeatKw: 120,
  airDensityKgPerM3: 1.2,
  airSpecificHeatKjPerKgK: 1,
  permittedTemperatureRiseK: 5,
  heatCaptureFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  requiredAirQuantityM3PerSecond: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ventilation-heat-removal",
  title: "Heat Removal Ventilation",
  description:
    "Balance sensible heat against air heat capacity and caller permitted rise; latent heat, humidity and worker heat-stress criteria are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredAirQuantityM3PerSecond",
      label: "Required air quantity m3 per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sensibleHeatKw: value.sensibleHeatKw as number,
      airDensityKgPerM3: value.airDensityKgPerM3 as number,
      airSpecificHeatKjPerKgK: value.airSpecificHeatKjPerKgK as number,
      permittedTemperatureRiseK: value.permittedTemperatureRiseK as number,
      heatCaptureFraction: value.heatCaptureFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
