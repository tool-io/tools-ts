import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
  interpolate,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampleWaterLiters: number;
  readonly titrantVolumesMl: readonly number[];
  readonly measuredPhValues: readonly number[];
  readonly targetPh: number;
  readonly systemWaterLiters: number;
}>;
export type Output = Readonly<{
  readonly interpolatedSampleTitrantMl: number;
  readonly scaledSystemTitrantLiters: number;
}>;
const inputFields = [
  { id: "sampleWaterLiters", label: "Sample water liters", kind: "number" },
  { id: "titrantVolumesMl", label: "Titrant volumes ml", kind: "numberList" },
  { id: "measuredPhValues", label: "Measured ph values", kind: "numberList" },
  { id: "targetPh", label: "Target ph", kind: "number" },
  { id: "systemWaterLiters", label: "System water liters", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.sampleWaterLiters, "sampleWaterLiters");
  positive(input.systemWaterLiters, "systemWaterLiters");
  input.titrantVolumesMl.forEach((v) => nonnegative(v, "titrantVolumesMl"));
  aligned(input.titrantVolumesMl, input.measuredPhValues, "titrantVolumesMl");
  ordered(input.titrantVolumesMl, "titrantVolumesMl");
  if (
    input.measuredPhValues.some((v) => v < 0 || v > 14) ||
    input.targetPh < 0 ||
    input.targetPh > 14
  )
    simpleError("targetPh", "Aquatic pH values within [0,14] required.");
  const ascending = input.measuredPhValues.at(-1)! > input.measuredPhValues[0],
    ph = ascending
      ? input.measuredPhValues
      : [...input.measuredPhValues].reverse(),
    doses = ascending
      ? input.titrantVolumesMl
      : [...input.titrantVolumesMl].reverse(),
    interpolatedSampleTitrantMl = interpolate(ph, doses, input.targetPh);
  return {
    interpolatedSampleTitrantMl,
    scaledSystemTitrantLiters:
      ((interpolatedSampleTitrantMl / input.sampleWaterLiters) *
        input.systemWaterLiters) /
      1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleWaterLiters: 1,
  titrantVolumesMl: [0, 1, 2],
  measuredPhValues: [7, 7.5, 8],
  targetPh: 7.75,
  systemWaterLiters: 1000,
} satisfies Input;
export const exampleOutput = {
  interpolatedSampleTitrantMl: 1.5,
  scaledSystemTitrantLiters: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/ph-adjustment",
  title: "pH Adjustment",
  description:
    "Interpolate a monotone measured titration curve and scale the identical-water/identical-titrant sample dose; no generic pH-to-reagent chemistry, equilibrium guarantee or operational dosing advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedSampleTitrantMl",
      label: "Interpolated sample titrant ml",
      kind: "number",
    },
    {
      id: "scaledSystemTitrantLiters",
      label: "Scaled system titrant liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleWaterLiters: value.sampleWaterLiters as number,
      titrantVolumesMl: value.titrantVolumesMl as readonly number[],
      measuredPhValues: value.measuredPhValues as readonly number[],
      targetPh: value.targetPh as number,
      systemWaterLiters: value.systemWaterLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
