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
  H.check(c !== 0n);
  return H.finish(H.fraction(a * d, b * c));
};
export const example = {
  input: {
    leftNumerator: "2",
    leftDenominator: "3",
    rightNumerator: "1",
    rightDenominator: "6",
  },
  output: { result: { numerator: "4", denominator: "1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-divide-exact",
  title: "Exact Fraction Division",
  description:
    "Exact rational division using decimal integer text and coprime output; no IEEE-754 precision loss.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
