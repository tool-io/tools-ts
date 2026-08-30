import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  mean,
  variance,
} from "../shared.js";
export type Input = Readonly<{
  readonly responseMagnitudes: readonly number[];
  readonly measurementNoiseVariance: number;
}>;
export type Output = Readonly<{
  readonly meanResponse: number;
  readonly noiseCorrectedVariance: number;
  readonly estimatedQuantalSize: number;
}>;
const inputFields = [
  {
    id: "responseMagnitudes",
    label: "Response magnitudes",
    kind: "numberList",
  },
  {
    id: "measurementNoiseVariance",
    label: "Measurement noise variance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.responseMagnitudes.forEach((v) => nonnegative(v, "responseMagnitudes"));
  nonnegative(input.measurementNoiseVariance, "measurementNoiseVariance");
  const meanResponse = positive(
      mean(input.responseMagnitudes),
      "responseMagnitudes",
    ),
    noiseCorrectedVariance = positive(
      variance(input.responseMagnitudes) - input.measurementNoiseVariance,
      "measurementNoiseVariance",
    );
  return {
    meanResponse,
    noiseCorrectedVariance,
    estimatedQuantalSize: noiseCorrectedVariance / meanResponse,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  responseMagnitudes: [1, 3, 5],
  measurementNoiseVariance: 1,
} satisfies Input;
export const exampleOutput = {
  meanResponse: 3,
  noiseCorrectedVariance: 3,
  estimatedQuantalSize: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/poisson-quantal-size-estimate",
  title: "Quantal Size",
  description:
    "Estimate quantal amplitude as noise-corrected variance/mean under identical-quantal Poisson release; finite-p binomial release and quantal variability violate this approximation.",
  inputs: inputFields,
  outputs: [
    { id: "meanResponse", label: "Mean response", kind: "number" },
    {
      id: "noiseCorrectedVariance",
      label: "Noise corrected variance",
      kind: "number",
    },
    {
      id: "estimatedQuantalSize",
      label: "Estimated quantal size",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      responseMagnitudes: value.responseMagnitudes as readonly number[],
      measurementNoiseVariance: value.measurementNoiseVariance as number,
    }),
});
export const run = tool.execute;
export default tool;
