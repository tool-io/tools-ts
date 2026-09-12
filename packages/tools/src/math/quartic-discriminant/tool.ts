import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  quarticDiscriminant,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualDescendingQuarticCoefficients: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDescendingQuarticCoefficients",
    label: "Actual descending quartic coefficients",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    quarticDiscriminant: quarticDiscriminant(
      input.actualDescendingQuarticCoefficients,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualDescendingQuarticCoefficients: [1, 0, 0, 0, -1] },
  output: { result: { quarticDiscriminant: -256 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/quartic-discriminant",
  title: "Quartic Discriminant Calculator",
  description:
    "Actual quartic a x\u2074+b x\u00b3+c x\u00b2+d x+e(a\u22600), Sylvester resultant(f, f\u2032)/aleadingcoefficient(sign positive for degree4). Finite binary64determinant, no arbitrary precision or root safety.",
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
