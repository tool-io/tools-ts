import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyMeasuredPeriphrasisWords: number;
  readonly independentlyMatchedDirectExpressionWords: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredPeriphrasisWords",
    label: "Independently measured periphrasis words",
    kind: "number",
  },
  {
    id: "independentlyMatchedDirectExpressionWords",
    label: "Independently matched direct expression words",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.independentlyMeasuredPeriphrasisWords,
    "independentlyMeasuredPeriphrasisWords",
  );
  positive(
    input.independentlyMatchedDirectExpressionWords,
    "independentlyMatchedDirectExpressionWords",
  );
  return {
    expressionExpansionRatio:
      input.independentlyMeasuredPeriphrasisWords /
      input.independentlyMatchedDirectExpressionWords,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredPeriphrasisWords: 8,
    independentlyMatchedDirectExpressionWords: 2,
  },
  output: { result: { expressionExpansionRatio: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/circumlocution-periphrasis-roundabout-checker",
  title: "Circumlocution Periphrasis Roundabout Checker",
  description:
    "Compare matched independently established circumlocution/direct-expression lengths; not semantic equivalence or bad-style judgement.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
