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
  count,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly responseMagnitudes: readonly number[];
  readonly tailResponses: number;
}>;
export type Output = Readonly<{
  readonly tailMeanMagnitude: number;
  readonly steadyStateFirstRatio: number;
  readonly fractionalDepression: number;
}>;
const inputFields = [
  {
    id: "responseMagnitudes",
    label: "Response magnitudes",
    kind: "numberList",
  },
  { id: "tailResponses", label: "Tail responses", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.responseMagnitudes.length)
    simpleError("responseMagnitudes", "Nonempty response train required.");
  input.responseMagnitudes.forEach((v) => nonnegative(v, "responseMagnitudes"));
  positive(input.responseMagnitudes[0], "responseMagnitudes");
  count(input.tailResponses, "tailResponses", 1);
  if (input.tailResponses >= input.responseMagnitudes.length)
    simpleError("tailResponses", "Tail must exclude the initial response.");
  const tailMeanMagnitude = mean(
      input.responseMagnitudes.slice(-input.tailResponses),
    ),
    steadyStateFirstRatio = tailMeanMagnitude / input.responseMagnitudes[0];
  return {
    tailMeanMagnitude,
    steadyStateFirstRatio,
    fractionalDepression: 1 - steadyStateFirstRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  responseMagnitudes: [10, 8, 6, 4, 4],
  tailResponses: 2,
} satisfies Input;
export const exampleOutput = {
  tailMeanMagnitude: 4,
  steadyStateFirstRatio: 0.4,
  fractionalDepression: 0.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/steady-state-train-depression",
  title: "Steady State Depression",
  description:
    "Summarize the last supplied train responses relative to the first response; a sampled tail is not proof that a true steady state was reached, and facilitation yields negative depression.",
  inputs: inputFields,
  outputs: [
    { id: "tailMeanMagnitude", label: "Tail mean magnitude", kind: "number" },
    {
      id: "steadyStateFirstRatio",
      label: "Steady state first ratio",
      kind: "number",
    },
    {
      id: "fractionalDepression",
      label: "Fractional depression",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      responseMagnitudes: value.responseMagnitudes as readonly number[],
      tailResponses: value.tailResponses as number,
    }),
});
export const run = tool.execute;
export default tool;
