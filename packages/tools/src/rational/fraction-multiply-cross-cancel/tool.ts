import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  leftNumerator: string;
  leftDenominator: string;
  rightNumerator: string;
  rightDenominator: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftNumerator", kind: "string", label: "leftNumerator" },
  { id: "leftDenominator", kind: "string", label: "leftDenominator" },
  { id: "rightNumerator", kind: "string", label: "rightNumerator" },
  { id: "rightDenominator", kind: "string", label: "rightDenominator" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [a, b] = H.fracInput(i.leftNumerator, i.leftDenominator),
    [c, d] = H.fracInput(i.rightNumerator, i.rightDenominator);
  return H.finish(
    H.fraction(
      (a / H.gcd(a, d)) * (c / H.gcd(c, b)),
      (b / H.gcd(c, b)) * (d / H.gcd(a, d)),
    ),
  );
};
export const example = {
  input: {
    leftNumerator: "2",
    leftDenominator: "3",
    rightNumerator: "1",
    rightDenominator: "6",
  },
  output: { result: { numerator: "1", denominator: "9" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-multiply-cross-cancel",
  title: "Cross Cancelled Fraction Multiplication",
  description:
    "Exact rational multiplication with cross cancellation using decimal integer text and coprime output; no IEEE-754 precision loss.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
