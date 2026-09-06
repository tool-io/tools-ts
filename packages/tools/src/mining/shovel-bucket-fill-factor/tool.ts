import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedWeighedShovelPayloadTonnes: readonly number[];
  readonly observedMatchedLooseDensityTonnesM3: readonly number[];
  readonly callerVerifiedHeapedBucketVolumesM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedBucketFillFactors: readonly number[];
}>;
const inputFields = [
  {
    id: "observedWeighedShovelPayloadTonnes",
    label: "Observed weighed shovel payload tonnes",
    kind: "numberList",
  },
  {
    id: "observedMatchedLooseDensityTonnesM3",
    label: "Observed matched loose density tonnes m3",
    kind: "numberList",
  },
  {
    id: "callerVerifiedHeapedBucketVolumesM3",
    label: "Caller verified heaped bucket volumes m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedLooseDensityTonnesM3.forEach((v) =>
    positive(v, "observedMatchedLooseDensityTonnesM3"),
  );
  input.callerVerifiedHeapedBucketVolumesM3.forEach((v) =>
    positive(v, "callerVerifiedHeapedBucketVolumesM3"),
  );
  input.observedWeighedShovelPayloadTonnes.forEach((v) =>
    nonnegative(v, "observedWeighedShovelPayloadTonnes"),
  );
  aligned(
    input.observedWeighedShovelPayloadTonnes,
    input.observedMatchedLooseDensityTonnesM3,
    "observedWeighedShovelPayloadTonnes",
  );
  aligned(
    input.observedWeighedShovelPayloadTonnes,
    input.callerVerifiedHeapedBucketVolumesM3,
    "observedWeighedShovelPayloadTonnes",
  );
  return {
    observedBucketFillFactors: input.observedWeighedShovelPayloadTonnes.map(
      (v, i) =>
        v /
        input.observedMatchedLooseDensityTonnesM3[i] /
        input.callerVerifiedHeapedBucketVolumesM3[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWeighedShovelPayloadTonnes: [2, 3],
  observedMatchedLooseDensityTonnesM3: [1, 2],
  callerVerifiedHeapedBucketVolumesM3: [2, 2],
} satisfies Input;
export const exampleOutput = {
  observedBucketFillFactors: [1, 0.75],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/shovel-bucket-fill-factor",
  title: "Shovel Bucket Fill Factor Calculator",
  description:
    "Infer actual shovel bucket fill from weighing/independent loose density and heaped volume, values>1 retained as evidence, not forward shovel productivity. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBucketFillFactors",
      label: "Observed bucket fill factors",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWeighedShovelPayloadTonnes:
        value.observedWeighedShovelPayloadTonnes as readonly number[],
      observedMatchedLooseDensityTonnesM3:
        value.observedMatchedLooseDensityTonnesM3 as readonly number[],
      callerVerifiedHeapedBucketVolumesM3:
        value.callerVerifiedHeapedBucketVolumesM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
