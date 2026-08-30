import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly ratePerHour: number;
  readonly timesHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly predictedLeachedFractions: readonly number[];
}>;
const inputFields = [
  { id: "ratePerHour", label: "Rate per hour", kind: "number" },
  { id: "timesHours", label: "Times hours", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.ratePerHour, "ratePerHour");
  input.timesHours.forEach((v) => nonnegative(v, "timesHours"));
  if (!input.timesHours.length)
    simpleError("timesHours", "Nonempty observation times required.");
  return {
    predictedLeachedFractions: input.timesHours.map(
      (t) => 1 - Math.max(0, 1 - input.ratePerHour * t) ** 3,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ratePerHour: 0.1,
  timesHours: [0, 1, 5, 10],
} satisfies Input;
export const exampleOutput = {
  predictedLeachedFractions: [0, 0.271, 0.875, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/leaching-kinetics",
  title: "Leaching Kinetics",
  description:
    "Evaluate ideal reaction-controlled shrinking-core leaching 1−(1−X)^(1/3)=kt capped at complete conversion; excludes diffusion control and reagent depletion.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedLeachedFractions",
      label: "Predicted leached fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      ratePerHour: value.ratePerHour as number,
      timesHours: value.timesHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
