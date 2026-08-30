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
  interpolate,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly densitiesKgPerM3: readonly number[];
  readonly referenceDepthM: number;
  readonly densityIncreaseCriterionKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly referenceDensityKgPerM3: number;
  readonly mixedLayerCriterionDepthM: number;
}>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  { id: "densitiesKgPerM3", label: "Densities kg per m3", kind: "numberList" },
  { id: "referenceDepthM", label: "Reference depth m", kind: "number" },
  {
    id: "densityIncreaseCriterionKgPerM3",
    label: "Density increase criterion kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.densitiesKgPerM3.forEach((v) => positive(v, "densitiesKgPerM3"));
  positive(
    input.densityIncreaseCriterionKgPerM3,
    "densityIncreaseCriterionKgPerM3",
  );
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  nonnegative(input.referenceDepthM, "referenceDepthM");
  const referenceDensityKgPerM3 = interpolate(
      input.depthsM,
      input.densitiesKgPerM3,
      input.referenceDepthM,
    ),
    target = referenceDensityKgPerM3 + input.densityIncreaseCriterionKgPerM3;
  let priorDepth = input.referenceDepthM,
    priorDensity = referenceDensityKgPerM3;
  for (let i = 0; i < input.depthsM.length; i++) {
    const d = input.depthsM[i];
    if (d <= input.referenceDepthM) continue;
    const rho = input.densitiesKgPerM3[i];
    if (rho >= target)
      return {
        referenceDensityKgPerM3,
        mixedLayerCriterionDepthM:
          priorDepth +
          ((d - priorDepth) * (target - priorDensity)) / (rho - priorDensity),
      };
    priorDepth = d;
    priorDensity = rho;
  }
  return simpleError(
    "densityIncreaseCriterionKgPerM3",
    "No first density crossing observed; MLD is right-censored.",
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 10, 20],
  densitiesKgPerM3: [1000, 1001, 1003],
  referenceDepthM: 5,
  densityIncreaseCriterionKgPerM3: 1,
} satisfies Input;
export const exampleOutput = {
  referenceDensityKgPerM3: 1000.5,
  mixedLayerCriterionDepthM: 12.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/mixed-layer-depth-density-criterion",
  title: "Mixed Layer Depth Density Criterion",
  description:
    "Locate the first density-increase crossing below an interpolated reference depth; deeper inversions do not change the first crossing, and absent crossings are not replaced by profile bottom.",
  inputs: inputFields,
  outputs: [
    {
      id: "referenceDensityKgPerM3",
      label: "Reference density kg per m3",
      kind: "number",
    },
    {
      id: "mixedLayerCriterionDepthM",
      label: "Mixed layer criterion depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      densitiesKgPerM3: value.densitiesKgPerM3 as readonly number[],
      referenceDepthM: value.referenceDepthM as number,
      densityIncreaseCriterionKgPerM3:
        value.densityIncreaseCriterionKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
