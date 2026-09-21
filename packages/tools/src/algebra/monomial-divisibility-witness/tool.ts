import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  divisorExponents: readonly number[];
  dividendExponents: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "divisorExponents", label: "Divisor exponents", kind: "numberList" },
  { id: "dividendExponents", label: "Dividend exponents", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.divisorExponents.length === i.dividendExponents.length);
  [...i.divisorExponents, ...i.dividendExponents].forEach((x) =>
    H.int(x, 0, 1000000),
  );
  const failure = i.divisorExponents.findIndex(
    (x, j) => x > i.dividendExponents[j],
  );
  return H.finish({ divides: failure === -1, firstFailureIndex: failure });
};
export const example = {
  input: { divisorExponents: [2, 1], dividendExponents: [3, 0] },
  output: { result: { divides: false, firstFailureIndex: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/monomial-divisibility-witness",
  title: "Algebra: Monomial Divisibility Witness Tool",
  description:
    "Check componentwise monomial divisibility and retain the first exponent coordinate that fails.",
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
          divides: { type: "boolean" },
          firstFailureIndex: { type: "number" },
        },
        required: ["divides", "firstFailureIndex"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
