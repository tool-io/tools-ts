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
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly elapsedTimes: readonly number[];
  readonly initialRetentionFraction: number;
  readonly asymptoticRetentionFraction: number;
  readonly timeConstant: number;
}>;
export type Output = Readonly<{
  readonly predictedRetentionFractions: readonly number[];
}>;
const inputFields = [
  { id: "elapsedTimes", label: "Elapsed times", kind: "numberList" },
  {
    id: "initialRetentionFraction",
    label: "Initial retention fraction",
    kind: "number",
  },
  {
    id: "asymptoticRetentionFraction",
    label: "Asymptotic retention fraction",
    kind: "number",
  },
  { id: "timeConstant", label: "Time constant", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.elapsedTimes.length)
    simpleError("elapsedTimes", "Nonempty elapsed times required.");
  input.elapsedTimes.forEach((v) => nonnegative(v, "elapsedTimes"));
  fraction(input.initialRetentionFraction, "initialRetentionFraction");
  fraction(input.asymptoticRetentionFraction, "asymptoticRetentionFraction");
  positive(input.timeConstant, "timeConstant");
  if (input.asymptoticRetentionFraction > input.initialRetentionFraction)
    simpleError(
      "asymptoticRetentionFraction",
      "Forgetting floor cannot exceed initial retention.",
    );
  return {
    predictedRetentionFractions: input.elapsedTimes.map(
      (t) =>
        input.asymptoticRetentionFraction +
        (input.initialRetentionFraction - input.asymptoticRetentionFraction) *
          Math.exp(-t / input.timeConstant),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  elapsedTimes: [0, 1, 2],
  initialRetentionFraction: 1,
  asymptoticRetentionFraction: 0.2,
  timeConstant: 1,
} satisfies Input;
export const exampleOutput = {
  predictedRetentionFractions: [1, 0.4943035529371539, 0.30826822658929015],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/exponential-forgetting-with-floor",
  title: "Ebbinghaus Forgetting Curve",
  description:
    "Evaluate a caller-calibrated exponential forgetting approximation with a nonzero floor; elapsed times and tau share one unit, and this is not a universal Ebbinghaus law.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedRetentionFractions",
      label: "Predicted retention fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      elapsedTimes: value.elapsedTimes as readonly number[],
      initialRetentionFraction: value.initialRetentionFraction as number,
      asymptoticRetentionFraction: value.asymptoticRetentionFraction as number,
      timeConstant: value.timeConstant as number,
    }),
});
export const run = tool.execute;
export default tool;
