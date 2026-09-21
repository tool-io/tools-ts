import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ a: number; b: number; c: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "a", label: "A", kind: "number" },
  { id: "b", label: "B", kind: "number" },
  { id: "c", label: "C", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.a !== 0);
  return H.finish({ rootSum: -i.b / i.a, rootProduct: i.c / i.a });
};
export const example = {
  input: { a: 2, b: -6, c: 4 },
  output: { result: { rootSum: 3, rootProduct: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/quadratic-vieta-coefficient-pair",
  title: "Algebra: Quadratic Vieta Coefficient Pair Tool",
  description:
    "Return Vieta sum/product of the two complex roots counted with multiplicity for one explicit nondegenerate quadratic; no root solver.",
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
          rootProduct: { type: "number" },
          rootSum: { type: "number" },
        },
        required: ["rootProduct", "rootSum"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
