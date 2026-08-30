import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly stimulusAnglesDegrees: readonly number[];
  readonly reactionTimesMs: readonly number[];
}>;
export type Output = Readonly<{
  readonly shortestRotationDegrees: readonly number[];
  readonly slopeMsPerDegree: number;
  readonly interceptMs: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  {
    id: "stimulusAnglesDegrees",
    label: "Stimulus angles degrees",
    kind: "numberList",
  },
  { id: "reactionTimesMs", label: "Reaction times ms", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.stimulusAnglesDegrees,
    input.reactionTimesMs,
    "stimulusAnglesDegrees",
  );
  input.reactionTimesMs.forEach((v) => positive(v, "reactionTimesMs"));
  const shortestRotationDegrees = input.stimulusAnglesDegrees.map((v) => {
      const wrapped = ((v % 360) + 360) % 360;
      return Math.min(wrapped, 360 - wrapped);
    }),
    fit = regression(shortestRotationDegrees, input.reactionTimesMs);
  return {
    shortestRotationDegrees,
    slopeMsPerDegree: fit.slope,
    interceptMs: fit.intercept,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stimulusAnglesDegrees: [0, 90, 270, 180],
  reactionTimesMs: [100, 190, 190, 280],
} satisfies Input;
export const exampleOutput = {
  shortestRotationDegrees: [0, 90, 90, 180],
  slopeMsPerDegree: 1,
  interceptMs: 100,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/shortest-angle-mental-rotation-slope",
  title: "Mental Rotation Slope",
  description:
    "Regress mental-rotation RT on shortest unsigned circular angular disparity, explicitly mapping 270° to 90°; task correctness filtering must precede input.",
  inputs: inputFields,
  outputs: [
    {
      id: "shortestRotationDegrees",
      label: "Shortest rotation degrees",
      kind: "numberList",
    },
    { id: "slopeMsPerDegree", label: "Slope ms per degree", kind: "number" },
    { id: "interceptMs", label: "Intercept ms", kind: "number" },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      stimulusAnglesDegrees: value.stimulusAnglesDegrees as readonly number[],
      reactionTimesMs: value.reactionTimesMs as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
