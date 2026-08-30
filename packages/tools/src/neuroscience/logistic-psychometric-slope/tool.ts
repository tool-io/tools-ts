import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly stimulus: number;
  readonly midpoint: number;
  readonly logisticScale: number;
  readonly guessRate: number;
  readonly lapseRate: number;
}>;
export type Output = Readonly<{
  readonly responseProbability: number;
  readonly probabilitySlopePerStimulus: number;
}>;
const inputFields = [
  { id: "stimulus", label: "Stimulus", kind: "number" },
  { id: "midpoint", label: "Midpoint", kind: "number" },
  { id: "logisticScale", label: "Logistic scale", kind: "number" },
  { id: "guessRate", label: "Guess rate", kind: "number" },
  { id: "lapseRate", label: "Lapse rate", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.logisticScale, "logisticScale");
  fraction(input.guessRate, "guessRate");
  fraction(input.lapseRate, "lapseRate");
  if (input.guessRate + input.lapseRate >= 1)
    simpleError("lapseRate", "Guess plus lapse rates must be below one.");
  const x = (input.stimulus - input.midpoint) / input.logisticScale,
    L = x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x)),
    range = 1 - input.guessRate - input.lapseRate;
  return {
    responseProbability: input.guessRate + range * L,
    probabilitySlopePerStimulus: (range * L * (1 - L)) / input.logisticScale,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stimulus: 0,
  midpoint: 0,
  logisticScale: 2,
  guessRate: 0.5,
  lapseRate: 0.1,
} satisfies Input;
export const exampleOutput = {
  responseProbability: 0.7,
  probabilitySlopePerStimulus: 0.05,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/logistic-psychometric-slope",
  title: "Psychometric Function Slope",
  description:
    "Evaluate a logistic psychometric response and local derivative with explicit guessing, lapse, midpoint and stimulus-unit scale.",
  inputs: inputFields,
  outputs: [
    {
      id: "responseProbability",
      label: "Response probability",
      kind: "number",
    },
    {
      id: "probabilitySlopePerStimulus",
      label: "Probability slope per stimulus",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stimulus: value.stimulus as number,
      midpoint: value.midpoint as number,
      logisticScale: value.logisticScale as number,
      guessRate: value.guessRate as number,
      lapseRate: value.lapseRate as number,
    }),
});
export const run = tool.execute;
export default tool;
