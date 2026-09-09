import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyCodedKindActions: number;
  readonly actualIndependentlyCodedUnkindActions: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyCodedKindActions",
    label: "Actual independently coded kind actions",
    kind: "number",
  },
  {
    id: "actualIndependentlyCodedUnkindActions",
    label: "Actual independently coded unkind actions",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualIndependentlyCodedKindActions, "numerator");
  positive(input.actualIndependentlyCodedUnkindActions, "denominator");
  return {
    observedRatio:
      (1 * input.actualIndependentlyCodedKindActions) /
      input.actualIndependentlyCodedUnkindActions,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyCodedKindActions: 2,
    actualIndependentlyCodedUnkindActions: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/kindness-ratio",
  title: "Kindness Ratio Calculator",
  description:
    "Actual independently coded kind/unkind interaction ratio, no validated universal kindness metric. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
