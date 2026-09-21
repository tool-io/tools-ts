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
  return H.finish({
    oddExponentMask: i.exponents.map((x) => x % 2 === 1),
    squareMonomial: i.exponents.every((x) => x % 2 === 0),
  });
};
export const example = {
  input: { exponents: [2, 3] },
  output: { result: { oddExponentMask: [false, true], squareMonomial: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/monomial-square-exponent-parity-mask",
  title: "Algebra: Monomial Square Exponent Parity Mask Tool",
  description:
    "Report odd exponent coordinates and the even-exponent condition for a formal monomial square, without assumptions about coefficients.",
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
          oddExponentMask: { type: "array", items: { type: "boolean" } },
          squareMonomial: { type: "boolean" },
        },
        required: ["oddExponentMask", "squareMonomial"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
