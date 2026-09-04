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
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedOverBarkDiameterCm: readonly number[];
  readonly observedUnderBarkDiameterCm: readonly number[];
  readonly observedRepresentedStemWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly diameterWeightedBarkConversionFactor: number;
}>;
const inputFields = [
  {
    id: "observedOverBarkDiameterCm",
    label: "Observed over bark diameter cm",
    kind: "numberList",
  },
  {
    id: "observedUnderBarkDiameterCm",
    label: "Observed under bark diameter cm",
    kind: "numberList",
  },
  {
    id: "observedRepresentedStemWeights",
    label: "Observed represented stem weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOverBarkDiameterCm.forEach((v) =>
    positive(v, "observedOverBarkDiameterCm"),
  );
  input.observedUnderBarkDiameterCm.forEach((v) =>
    nonnegative(v, "observedUnderBarkDiameterCm"),
  );
  input.observedRepresentedStemWeights.forEach((v) =>
    nonnegative(v, "observedRepresentedStemWeights"),
  );
  aligned(
    input.observedOverBarkDiameterCm,
    input.observedUnderBarkDiameterCm,
    "observedOverBarkDiameterCm",
  );
  aligned(
    input.observedOverBarkDiameterCm,
    input.observedRepresentedStemWeights,
    "observedOverBarkDiameterCm",
  );
  input.observedUnderBarkDiameterCm.forEach((v, i) => {
    if (v > input.observedOverBarkDiameterCm[i])
      simpleError(
        "bark",
        "Under-bark diameter cannot exceed matched over-bark diameter.",
      );
  });
  const denominator = sum(
    input.observedOverBarkDiameterCm.map(
      (v, i) => v * input.observedRepresentedStemWeights[i],
    ),
  );
  positive(denominator, "weighted diameter");
  return {
    diameterWeightedBarkConversionFactor:
      sum(
        input.observedUnderBarkDiameterCm.map(
          (v, i) => v * input.observedRepresentedStemWeights[i],
        ),
      ) / denominator,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOverBarkDiameterCm: [10, 20],
  observedUnderBarkDiameterCm: [8, 18],
  observedRepresentedStemWeights: [1, 2],
} satisfies Input;
export const exampleOutput = {
  diameterWeightedBarkConversionFactor: 0.88,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/bark-factor",
  title: "Bark Factor Calculator",
  description:
    "Extract inventory-weighted diameter bark conversion factor, not single stem radial thickness, squared area bark percentage or identical taper assumption. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "diameterWeightedBarkConversionFactor",
      label: "Diameter weighted bark conversion factor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOverBarkDiameterCm:
        value.observedOverBarkDiameterCm as readonly number[],
      observedUnderBarkDiameterCm:
        value.observedUnderBarkDiameterCm as readonly number[],
      observedRepresentedStemWeights:
        value.observedRepresentedStemWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
