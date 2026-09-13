import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
  binary,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly independentlyQualifiedCategoryCompletedFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyQualifiedCategoryCompletedFlags",
    label: "Independently qualified category completed flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyQualifiedCategoryCompletedFlags.length)
    simpleError(
      "independentlyQualifiedCategoryCompletedFlags",
      "Actual nonempty observations.",
    );
  input.independentlyQualifiedCategoryCompletedFlags.forEach((v) =>
    nonnegative(v, "independentlyQualifiedCategoryCompletedFlags"),
  );
  binary(input.independentlyQualifiedCategoryCompletedFlags, "completed");
  return { value: sum(input.independentlyQualifiedCategoryCompletedFlags) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyQualifiedCategoryCompletedFlags: [1, 0, 1] },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/wcst-categories-completed",
  title: "WCST Categories Completed Counter",
  description:
    "WCST actual independently qualified distinct category completion flags, sum; no automatic card sorting, per sever at ion assessment or licensed normative score. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
