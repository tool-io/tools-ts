import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly densitiesKgPerM3: readonly number[];
  readonly referenceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly signedBuoyancyFrequencySquaredPerSecondSquared: readonly number[];
  readonly stableIntervalFlags: readonly number[];
}>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  { id: "densitiesKgPerM3", label: "Densities kg per m3", kind: "numberList" },
  {
    id: "referenceDensityKgPerM3",
    label: "Reference density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.densitiesKgPerM3.forEach((v) => positive(v, "densitiesKgPerM3"));
  positive(input.referenceDensityKgPerM3, "referenceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  aligned(input.depthsM, input.densitiesKgPerM3, "depthsM");
  ordered(input.depthsM, "depthsM");
  const signedBuoyancyFrequencySquaredPerSecondSquared = input.depthsM
    .slice(1)
    .map(
      (z, i) =>
        ((input.gravityMPerSecondSquared / input.referenceDensityKgPerM3) *
          (input.densitiesKgPerM3[i + 1] - input.densitiesKgPerM3[i])) /
        (z - input.depthsM[i]),
    );
  return {
    signedBuoyancyFrequencySquaredPerSecondSquared,
    stableIntervalFlags: signedBuoyancyFrequencySquaredPerSecondSquared.map(
      (v) => (v > 0 ? 1 : 0),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 10, 20],
  densitiesKgPerM3: [1000, 1002, 1001],
  referenceDensityKgPerM3: 1000,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  signedBuoyancyFrequencySquaredPerSecondSquared: [0.002, -0.001],
  stableIntervalFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/density-gradient-stratification-strength",
  title: "Density Gradient Stratification Strength",
  description:
    "Compute signed N² from observed density gradients with depth positive down; negative values remain instability indicators rather than an invented real Brunt–Väisälä frequency.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedBuoyancyFrequencySquaredPerSecondSquared",
      label: "Signed buoyancy frequency squared per second squared",
      kind: "numberList",
    },
    {
      id: "stableIntervalFlags",
      label: "Stable interval flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      densitiesKgPerM3: value.densitiesKgPerM3 as readonly number[],
      referenceDensityKgPerM3: value.referenceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
