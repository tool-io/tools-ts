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
  readonly callerGsiComponentRatings: readonly number[];
  readonly knownGsiComponentFlags: readonly number[];
  readonly callerGsiMissingComponentMaximums: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownRatingSubtotal: number;
  readonly wholeRatingLowerBound: number;
  readonly wholeRatingUpperBound: number;
}>;
const inputFields = [
  {
    id: "callerGsiComponentRatings",
    label: "Caller gsi component ratings",
    kind: "numberList",
  },
  {
    id: "knownGsiComponentFlags",
    label: "Known gsi component flags",
    kind: "numberList",
  },
  {
    id: "callerGsiMissingComponentMaximums",
    label: "Caller gsi missing component maximums",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerGsiComponentRatings.forEach((v) =>
    nonnegative(v, "callerGsiComponentRatings"),
  );
  input.callerGsiMissingComponentMaximums.forEach((v) =>
    nonnegative(v, "callerGsiMissingComponentMaximums"),
  );
  binary(input.knownGsiComponentFlags, "knownGsiComponentFlags");
  aligned(
    input.callerGsiComponentRatings,
    input.knownGsiComponentFlags,
    "callerGsiComponentRatings",
  );
  aligned(
    input.callerGsiComponentRatings,
    input.callerGsiMissingComponentMaximums,
    "callerGsiComponentRatings",
  );
  input.callerGsiComponentRatings.forEach((v, i) => {
    if (v > input.callerGsiMissingComponentMaximums[i])
      simpleError(
        "rating",
        "Observed component within independently verified component maximum.",
      );
  });
  const known = sum(
      input.callerGsiComponentRatings.filter(
        (_, i) => input.knownGsiComponentFlags[i],
      ),
    ),
    missing = sum(
      input.callerGsiMissingComponentMaximums.filter(
        (_, i) => !input.knownGsiComponentFlags[i],
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
  callerGsiComponentRatings: [20, 30],
  knownGsiComponentFlags: [1, 0],
  callerGsiMissingComponentMaximums: [20, 40],
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
  id: "mining/gsi-rating",
  title: "GSI Rating Calculator",
  description:
    "Audit independently assigned GSI edition-specific component ratings with explicit unknown maximum bounds, no rock-mass class from unspecified photographs or universal component table. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      callerGsiComponentRatings:
        value.callerGsiComponentRatings as readonly number[],
      knownGsiComponentFlags: value.knownGsiComponentFlags as readonly number[],
      callerGsiMissingComponentMaximums:
        value.callerGsiMissingComponentMaximums as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
