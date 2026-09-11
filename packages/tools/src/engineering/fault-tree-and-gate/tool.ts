import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly independentEventProbabilities: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentEventProbabilities",
    label: "Independent event probabilities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentEventProbabilities.length)
    simpleError(
      "independentEventProbabilities",
      "Actual nonempty observations.",
    );
  input.independentEventProbabilities.forEach((v) =>
    fraction(v, "independentEventProbabilities"),
  );
  return {
    value: input.independentEventProbabilities.reduce((a, b) => a * b, 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentEventProbabilities: [0.5, 0.2] },
  output: { result: { value: 0.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/fault-tree-and-gate",
  title: "Fault Tree AND Gate Calculator",
  description:
    "AND gate failure probability product only under independently established mutual independence/no common cause. Not a safe system assessment. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
