import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedDass21SubscaleSum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedDass21SubscaleSum",
    label: "Independently established dass21 subscale sum",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.independentlyEstablishedDass21SubscaleSum,
    "independentlyEstablishedDass21SubscaleSum",
    0,
    1000000,
  );
  bounded(
    input.independentlyEstablishedDass21SubscaleSum,
    "DASS21subscale",
    0,
    21,
  );
  return { value: 2 * input.independentlyEstablishedDass21SubscaleSum };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyEstablishedDass21SubscaleSum: 10 },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/dass21-to-dass42-subscale-converter",
  title: "DASS-21 to DASS-42 Subscale Converter",
  description:
    "DASS21seven-item0\u20133subscale sum doubled to DASS42conventional metric, actual integer0\u201321, not new symptom coding or diagnostic classification. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
