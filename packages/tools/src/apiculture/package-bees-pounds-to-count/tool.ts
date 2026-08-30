import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly packageNetBeeMassPounds: number;
  readonly sampleBeeCounts: readonly number[];
  readonly sampleNetMassesGrams: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledMeanBeeMassGrams: number;
  readonly estimatedPackageBeeCount: number;
}>;
const inputFields = [
  {
    id: "packageNetBeeMassPounds",
    label: "Package net bee mass pounds",
    kind: "number",
  },
  { id: "sampleBeeCounts", label: "Sample bee counts", kind: "numberList" },
  {
    id: "sampleNetMassesGrams",
    label: "Sample net masses grams",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampleBeeCounts.forEach((v) => positive(v, "sampleBeeCounts"));
  input.sampleNetMassesGrams.forEach((v) =>
    positive(v, "sampleNetMassesGrams"),
  );
  nonnegative(input.packageNetBeeMassPounds, "packageNetBeeMassPounds");
  input.sampleBeeCounts.forEach((v) => count(v, "sampleBeeCounts"));
  aligned(input.sampleBeeCounts, input.sampleNetMassesGrams, "sampleBeeCounts");
  const pooledMeanBeeMassGrams =
    input.sampleNetMassesGrams.reduce((a, b) => a + b, 0) /
    input.sampleBeeCounts.reduce((a, b) => a + b, 0);
  return {
    pooledMeanBeeMassGrams,
    estimatedPackageBeeCount:
      (input.packageNetBeeMassPounds * 453.59237) / pooledMeanBeeMassGrams,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  packageNetBeeMassPounds: 1000 / 453.59237,
  sampleBeeCounts: [100, 200],
  sampleNetMassesGrams: [10, 30],
} satisfies Input;
export const exampleOutput = {
  pooledMeanBeeMassGrams: 0.13333333333333333,
  estimatedPackageBeeCount: 7500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/package-bees-pounds-to-count",
  title: "Package Bees Pounds To Count Converter",
  description:
    "Infer package bee count from measured net bee pounds (453.59237 g/lb) and pooled count/mass calibration samples; cage/feed tare must be removed and no fixed bees-per-pound biological constant is embedded.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledMeanBeeMassGrams",
      label: "Pooled mean bee mass grams",
      kind: "number",
    },
    {
      id: "estimatedPackageBeeCount",
      label: "Estimated package bee count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      packageNetBeeMassPounds: value.packageNetBeeMassPounds as number,
      sampleBeeCounts: value.sampleBeeCounts as readonly number[],
      sampleNetMassesGrams: value.sampleNetMassesGrams as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
