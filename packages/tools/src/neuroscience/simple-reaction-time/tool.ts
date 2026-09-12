import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  mean,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCorrectEligibleSimpleRtMilliseconds: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCorrectEligibleSimpleRtMilliseconds",
    label: "Actual correct eligible simple rt milliseconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualCorrectEligibleSimpleRtMilliseconds.length)
    simpleError(
      "actualCorrectEligibleSimpleRtMilliseconds",
      "Actual nonempty observations.",
    );
  input.actualCorrectEligibleSimpleRtMilliseconds.forEach((v) =>
    nonnegative(v, "RT"),
  );
  return { value: mean(input.actualCorrectEligibleSimpleRtMilliseconds) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCorrectEligibleSimpleRtMilliseconds: [100, 300] },
  output: { result: { value: 200 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/simple-reaction-time",
  title: "Simple Reaction Time Calculator",
  description:
    "Mean actual correct eligible simple RT observations, no inferred prediction from age/IQor stimulus count. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
