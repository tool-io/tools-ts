import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  coefficient: number;
  exponents: readonly number[];
  variableIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficient", label: "Coefficient", kind: "number" },
  { id: "exponents", label: "Exponents", kind: "numberList" },
  { id: "variableIndex", label: "Variable index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.exponents.forEach((x) => H.int(x, 0, 1000000));
  H.int(i.variableIndex, 0, i.exponents.length - 1);
  const power = i.exponents[i.variableIndex];
  return H.finish({
    coefficient: i.coefficient * power,
    exponents:
      power === 0
        ? i.exponents
        : i.exponents.map((x, j) => (j === i.variableIndex ? x - 1 : x)),
    zero: power === 0 || i.coefficient === 0,
  });
};
export const example = {
  input: { coefficient: 3, exponents: [2, 1], variableIndex: 0 },
  output: { result: { coefficient: 6, exponents: [1, 1], zero: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/monomial-variable-partial-term",
  title: "Algebra: Monomial Variable Partial Term Tool",
  description:
    "Differentiate one explicit monomial with respect to one variable index; a zero derivative retains the original exponent vector as unused witness.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coefficient: { type: "number" },
          exponents: { type: "array", items: { type: "number" } },
          zero: { type: "boolean" },
        },
        required: ["coefficient", "exponents", "zero"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
