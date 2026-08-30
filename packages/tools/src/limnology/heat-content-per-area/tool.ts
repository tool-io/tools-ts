import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  layerGeometry,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthBoundariesM: readonly number[];
  readonly layerAreasM2: readonly number[];
  readonly layerTemperaturesC: readonly number[];
  readonly referenceTemperatureC: number;
  readonly waterDensityKgPerM3: number;
  readonly specificHeatJPerKgK: number;
}>;
export type Output = Readonly<{
  readonly signedHeatContentJ: number;
  readonly heatContentPerSurfaceAreaJPerM2: number;
}>;
const inputFields = [
  { id: "depthBoundariesM", label: "Depth boundaries m", kind: "numberList" },
  { id: "layerAreasM2", label: "Layer areas m2", kind: "numberList" },
  {
    id: "layerTemperaturesC",
    label: "Layer temperatures c",
    kind: "numberList",
  },
  {
    id: "referenceTemperatureC",
    label: "Reference temperature c",
    kind: "number",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "specificHeatJPerKgK",
    label: "Specific heat j per kg k",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.specificHeatJPerKgK, "specificHeatJPerKgK");
  aligned(input.layerAreasM2, input.layerTemperaturesC, "layerAreasM2");
  const g = layerGeometry(input.depthBoundariesM, input.layerAreasM2),
    signedHeatContentJ =
      g.volumes.reduce(
        (s, v, i) =>
          s + v * (input.layerTemperaturesC[i] - input.referenceTemperatureC),
        0,
      ) *
      input.waterDensityKgPerM3 *
      input.specificHeatJPerKgK;
  return {
    signedHeatContentJ,
    heatContentPerSurfaceAreaJPerM2: signedHeatContentJ / g.surfaceArea,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthBoundariesM: [0, 1, 2],
  layerAreasM2: [100, 50],
  layerTemperaturesC: [10, 5],
  referenceTemperatureC: 0,
  waterDensityKgPerM3: 1000,
  specificHeatJPerKgK: 4000,
} satisfies Input;
export const exampleOutput = {
  signedHeatContentJ: 5000000000,
  heatContentPerSurfaceAreaJPerM2: 50000000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/heat-content-per-area",
  title: "Heat Content Per Area",
  description:
    "Compute lake sensible heat relative to caller temperature from layer volumes and constant supplied density/heat capacity; reference changes alter absolute content, not heat differences.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedHeatContentJ",
      label: "Signed heat content j",
      kind: "number",
    },
    {
      id: "heatContentPerSurfaceAreaJPerM2",
      label: "Heat content per surface area j per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      depthBoundariesM: value.depthBoundariesM as readonly number[],
      layerAreasM2: value.layerAreasM2 as readonly number[],
      layerTemperaturesC: value.layerTemperaturesC as readonly number[],
      referenceTemperatureC: value.referenceTemperatureC as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      specificHeatJPerKgK: value.specificHeatJPerKgK as number,
    }),
});
export const run = tool.execute;
export default tool;
