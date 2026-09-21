import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ exponents: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "exponents", label: "Exponents", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.exponents.forEach((x) => H.int(x, 0, 1000000));
  return H.finish({ totalDegree: i.exponents.reduce((s, x) => s + x, 0) });
};
export const example = {
  input: { exponents: [2, 0, 3] },
  output: { result: { totalDegree: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/monomial-total-degree",
  title: "Algebra: Monomial Total Degree Tool",
  description:
    "Sum nonnegative integer exponents of one explicit monomial; an empty exponent vector denotes a constant.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { totalDegree: { type: "number" } },
        required: ["totalDegree"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
