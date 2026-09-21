import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  leftExponents: readonly number[];
  rightExponents: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftExponents", label: "Left exponents", kind: "numberList" },
  { id: "rightExponents", label: "Right exponents", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.leftExponents.length === i.rightExponents.length);
  [...i.leftExponents, ...i.rightExponents].forEach((x) =>
    H.int(x, 0, 1000000),
  );
  return H.finish({
    exponents: i.leftExponents.map((x, j) => Math.max(x, i.rightExponents[j])),
  });
};
export const example = {
  input: { leftExponents: [1, 3], rightExponents: [2, 1] },
  output: { result: { exponents: [2, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/monomial-lcm-exponent-vector",
  title: "Algebra: Monomial Lcm Exponent Vector Tool",
  description:
    "Compute the formal monomial LCM exponent vector in a common declared variable order, ignoring coefficients.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { exponents: { type: "array", items: { type: "number" } } },
        required: ["exponents"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
