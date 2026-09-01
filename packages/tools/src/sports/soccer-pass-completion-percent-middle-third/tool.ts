import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedMiddleThirdPassAttempts: readonly number[];
  readonly observedCompletedMiddleThirdPasses: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledMiddleThirdPassCompletionPercent: number;
}>;
const inputFields = [
  {
    id: "observedMiddleThirdPassAttempts",
    label: "Observed middle third pass attempts",
    kind: "numberList",
  },
  {
    id: "observedCompletedMiddleThirdPasses",
    label: "Observed completed middle third passes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedMiddleThirdPassAttempts,
    input.observedCompletedMiddleThirdPasses,
    "matches",
  );
  input.observedMiddleThirdPassAttempts.forEach((v) =>
    bounded(v, "attempts", 0, 1000000),
  );
  input.observedCompletedMiddleThirdPasses.forEach((v, i) =>
    bounded(v, "made", 0, input.observedMiddleThirdPassAttempts[i]),
  );
  positive(sum(input.observedMiddleThirdPassAttempts), "attempts");
  return {
    pooledMiddleThirdPassCompletionPercent:
      (100 * sum(input.observedCompletedMiddleThirdPasses)) /
      sum(input.observedMiddleThirdPassAttempts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMiddleThirdPassAttempts: [5, 10],
  observedCompletedMiddleThirdPasses: [2, 6],
} satisfies Input;
export const exampleOutput = {
  pooledMiddleThirdPassCompletionPercent: 53.333333333333336,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/soccer-pass-completion-percent-middle-third",
  title: "Middle-Third Pass Completion %",
  description:
    "Pool actual soccer middle-third passes over matched opportunity counts, not unweighted match percentages or general success inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledMiddleThirdPassCompletionPercent",
      label: "Pooled middle third pass completion percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMiddleThirdPassAttempts:
        value.observedMiddleThirdPassAttempts as readonly number[],
      observedCompletedMiddleThirdPasses:
        value.observedCompletedMiddleThirdPasses as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
