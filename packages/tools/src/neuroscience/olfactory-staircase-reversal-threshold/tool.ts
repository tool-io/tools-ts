import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, mean } from "../shared.js";
export type Input = Readonly<{
  readonly dilutionSteps: readonly number[];
  readonly reversalsToAverage: number;
}>;
export type Output = Readonly<{
  readonly reversalIndexes: readonly number[];
  readonly meanReversalStep: number;
}>;
const inputFields = [
  { id: "dilutionSteps", label: "Dilution steps", kind: "numberList" },
  { id: "reversalsToAverage", label: "Reversals to average", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.dilutionSteps.length < 3)
    simpleError("dilutionSteps", "At least three staircase levels required.");
  count(input.reversalsToAverage, "reversalsToAverage", 1);
  const reversalIndexes: number[] = [];
  let previousDirection = 0,
    lastMovingIndex = 0;
  for (let i = 1; i < input.dilutionSteps.length; i++) {
    const direction = Math.sign(
      input.dilutionSteps[i] - input.dilutionSteps[i - 1],
    );
    if (direction === 0) continue;
    if (previousDirection !== 0 && direction !== previousDirection)
      reversalIndexes.push(lastMovingIndex);
    previousDirection = direction;
    lastMovingIndex = i;
  }
  if (reversalIndexes.length < input.reversalsToAverage)
    simpleError(
      "reversalsToAverage",
      "Not enough staircase reversals observed.",
    );
  return {
    reversalIndexes,
    meanReversalStep: mean(
      reversalIndexes
        .slice(-input.reversalsToAverage)
        .map((i) => input.dilutionSteps[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dilutionSteps: [1, 2, 3, 2, 1, 2, 3, 2],
  reversalsToAverage: 3,
} satisfies Input;
export const exampleOutput = {
  reversalIndexes: [2, 4, 6],
  meanReversalStep: 2.3333333333333335,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/olfactory-staircase-reversal-threshold",
  title: "Olfactory Threshold",
  description:
    "Detect directional staircase reversals and average the caller-selected last reversals for an olfactory dilution-step threshold; concentration calibration is external.",
  inputs: inputFields,
  outputs: [
    { id: "reversalIndexes", label: "Reversal indexes", kind: "numberList" },
    { id: "meanReversalStep", label: "Mean reversal step", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      dilutionSteps: value.dilutionSteps as readonly number[],
      reversalsToAverage: value.reversalsToAverage as number,
    }),
});
export const run = tool.execute;
export default tool;
