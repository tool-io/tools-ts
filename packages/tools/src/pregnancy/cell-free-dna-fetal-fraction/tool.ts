import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstimatedFetalOriginFragments: number;
  readonly independentlyMatchedTotalFragments: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstimatedFetalOriginFragments",
    label: "Independently estimated fetal origin fragments",
    kind: "number",
  },
  {
    id: "independentlyMatchedTotalFragments",
    label: "Independently matched total fragments",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyEstimatedFetalOriginFragments, "numerator");
  positive(input.independentlyMatchedTotalFragments, "denominator");
  return {
    observedRatio:
      (100 * input.independentlyEstimatedFetalOriginFragments) /
      input.independentlyMatchedTotalFragments,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstimatedFetalOriginFragments: 2,
    independentlyMatchedTotalFragments: 4,
  },
  output: { result: { observedRatio: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/cell-free-dna-fetal-fraction",
  title: "Cell-Free DNA Fetal Fraction Calculator",
  description:
    "Conditional cell-free-DNA fetal-origin fragment fraction after independently verified laboratory origin assignment, not sequence-based classification or test sufficiency. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
