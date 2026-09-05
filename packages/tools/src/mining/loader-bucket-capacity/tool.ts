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
  readonly observedLoaderPayloadTonnes: readonly number[];
  readonly observedIndependentLooseDensityTonnesM3: readonly number[];
  readonly callerMatchedLoaderFillFactors: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredEquivalentLoaderHeapedVolumesM3: readonly number[];
}>;
const inputFields = [
  {
    id: "observedLoaderPayloadTonnes",
    label: "Observed loader payload tonnes",
    kind: "numberList",
  },
  {
    id: "observedIndependentLooseDensityTonnesM3",
    label: "Observed independent loose density tonnes m3",
    kind: "numberList",
  },
  {
    id: "callerMatchedLoaderFillFactors",
    label: "Caller matched loader fill factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIndependentLooseDensityTonnesM3.forEach((v) =>
    positive(v, "observedIndependentLooseDensityTonnesM3"),
  );
  input.callerMatchedLoaderFillFactors.forEach((v) =>
    positive(v, "callerMatchedLoaderFillFactors"),
  );
  input.observedLoaderPayloadTonnes.forEach((v) =>
    nonnegative(v, "observedLoaderPayloadTonnes"),
  );
  aligned(
    input.observedLoaderPayloadTonnes,
    input.observedIndependentLooseDensityTonnesM3,
    "observedLoaderPayloadTonnes",
  );
  aligned(
    input.observedLoaderPayloadTonnes,
    input.callerMatchedLoaderFillFactors,
    "observedLoaderPayloadTonnes",
  );
  return {
    inferredEquivalentLoaderHeapedVolumesM3:
      input.observedLoaderPayloadTonnes.map(
        (v, i) =>
          v /
          input.observedIndependentLooseDensityTonnesM3[i] /
          input.callerMatchedLoaderFillFactors[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLoaderPayloadTonnes: [2, 6],
  observedIndependentLooseDensityTonnesM3: [1, 2],
  callerMatchedLoaderFillFactors: [0.5, 0.75],
} satisfies Input;
export const exampleOutput = {
  inferredEquivalentLoaderHeapedVolumesM3: [4, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/loader-bucket-capacity",
  title: "Loader Bucket Capacity Calculator",
  description:
    "Infer equivalent loader bucket volume from independently weighed payload/density/fill observations, not required equipment sizing or actual rated bucket capacity. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredEquivalentLoaderHeapedVolumesM3",
      label: "Inferred equivalent loader heaped volumes m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLoaderPayloadTonnes:
        value.observedLoaderPayloadTonnes as readonly number[],
      observedIndependentLooseDensityTonnesM3:
        value.observedIndependentLooseDensityTonnesM3 as readonly number[],
      callerMatchedLoaderFillFactors:
        value.callerMatchedLoaderFillFactors as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
