import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly meanResponse: number;
  readonly responseVariance: number;
  readonly quantalMagnitude: number;
  readonly measurementNoiseVariance: number;
}>;
export type Output = Readonly<{
  readonly inferredReleaseProbability: number;
  readonly effectiveReleaseSiteCount: number;
}>;
const inputFields = [
  { id: "meanResponse", label: "Mean response", kind: "number" },
  { id: "responseVariance", label: "Response variance", kind: "number" },
  { id: "quantalMagnitude", label: "Quantal magnitude", kind: "number" },
  {
    id: "measurementNoiseVariance",
    label: "Measurement noise variance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.meanResponse, "meanResponse");
  nonnegative(input.responseVariance, "responseVariance");
  positive(input.quantalMagnitude, "quantalMagnitude");
  nonnegative(input.measurementNoiseVariance, "measurementNoiseVariance");
  const v = input.responseVariance - input.measurementNoiseVariance;
  nonnegative(v, "measurementNoiseVariance");
  const inferredReleaseProbability =
    1 - v / (input.quantalMagnitude * input.meanResponse);
  if (inferredReleaseProbability <= 0 || inferredReleaseProbability > 1)
    simpleError(
      "responseVariance",
      "Moments are incompatible with the identical-quantal binomial model.",
    );
  return {
    inferredReleaseProbability,
    effectiveReleaseSiteCount:
      input.meanResponse /
      (input.quantalMagnitude * inferredReleaseProbability),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  meanResponse: 10,
  responseVariance: 5,
  quantalMagnitude: 1,
  measurementNoiseVariance: 0,
} satisfies Input;
export const exampleOutput = {
  inferredReleaseProbability: 0.5,
  effectiveReleaseSiteCount: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/binomial-active-zone-estimate",
  title: "Active Zone Number",
  description:
    "Infer effective release-site count and p from binomial mean/variance and independently measured quantal magnitude; N is not rounded or claimed to count anatomical active zones.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredReleaseProbability",
      label: "Inferred release probability",
      kind: "number",
    },
    {
      id: "effectiveReleaseSiteCount",
      label: "Effective release site count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      meanResponse: value.meanResponse as number,
      responseVariance: value.responseVariance as number,
      quantalMagnitude: value.quantalMagnitude as number,
      measurementNoiseVariance: value.measurementNoiseVariance as number,
    }),
});
export const run = tool.execute;
export default tool;
