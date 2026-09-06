import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerRmrComponentRatings: readonly number[];
  readonly knownRmrComponentFlags: readonly number[];
  readonly callerRmrMissingComponentMaximums: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownRatingSubtotal: number;
  readonly wholeRatingLowerBound: number;
  readonly wholeRatingUpperBound: number;
}>;
const inputFields = [
  {
    id: "callerRmrComponentRatings",
    label: "Caller rmr component ratings",
    kind: "numberList",
  },
  {
    id: "knownRmrComponentFlags",
    label: "Known rmr component flags",
    kind: "numberList",
  },
  {
    id: "callerRmrMissingComponentMaximums",
    label: "Caller rmr missing component maximums",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerRmrComponentRatings.forEach((v) =>
    nonnegative(v, "callerRmrComponentRatings"),
  );
  input.callerRmrMissingComponentMaximums.forEach((v) =>
    nonnegative(v, "callerRmrMissingComponentMaximums"),
  );
  binary(input.knownRmrComponentFlags, "knownRmrComponentFlags");
  aligned(
    input.callerRmrComponentRatings,
    input.knownRmrComponentFlags,
    "callerRmrComponentRatings",
  );
  aligned(
    input.callerRmrComponentRatings,
    input.callerRmrMissingComponentMaximums,
    "callerRmrComponentRatings",
  );
  input.callerRmrComponentRatings.forEach((v, i) => {
    if (v > input.callerRmrMissingComponentMaximums[i])
      simpleError(
        "rating",
        "Observed component within independently verified component maximum.",
      );
  });
  const known = sum(
      input.callerRmrComponentRatings.filter(
        (_, i) => input.knownRmrComponentFlags[i],
      ),
    ),
    missing = sum(
      input.callerRmrMissingComponentMaximums.filter(
        (_, i) => !input.knownRmrComponentFlags[i],
      ),
    );
  if (known + missing > 100)
    simpleError("rating", "Caller rating model maximum 100.");
  return {
    knownRatingSubtotal: known,
    wholeRatingLowerBound: known,
    wholeRatingUpperBound: known + missing,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRmrComponentRatings: [20, 30],
  knownRmrComponentFlags: [1, 0],
  callerRmrMissingComponentMaximums: [20, 40],
} satisfies Input;
export const exampleOutput = {
  knownRatingSubtotal: 20,
  wholeRatingLowerBound: 20,
  wholeRatingUpperBound: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/rmr-rating",
  title: "RMR Rating Calculator",
  description:
    "Audit independently assigned RMR edition-specific component ratings with explicit unknown maximum bounds, no rock-mass class from unspecified photographs or universal component table. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownRatingSubtotal",
      label: "Known rating subtotal",
      kind: "number",
    },
    {
      id: "wholeRatingLowerBound",
      label: "Whole rating lower bound",
      kind: "number",
    },
    {
      id: "wholeRatingUpperBound",
      label: "Whole rating upper bound",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRmrComponentRatings:
        value.callerRmrComponentRatings as readonly number[],
      knownRmrComponentFlags: value.knownRmrComponentFlags as readonly number[],
      callerRmrMissingComponentMaximums:
        value.callerRmrMissingComponentMaximums as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
