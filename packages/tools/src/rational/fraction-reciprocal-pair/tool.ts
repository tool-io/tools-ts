import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ numerator: string; denominator: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "numerator", kind: "string", label: "numerator" },
  { id: "denominator", kind: "string", label: "denominator" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const [n, d] = H.fracInput(i.numerator, i.denominator);
  H.check(n !== 0n);
  return H.finish(H.fraction(d, n));
};
export const example = {
  input: { numerator: "-2", denominator: "3" },
  output: { result: { numerator: "-3", denominator: "2" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-reciprocal-pair",
  title: "Fraction Reciprocal Pair",
  description:
    "Return the exact reciprocal of a nonzero rational in canonical integer text; zero reciprocal is rejected.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numerator: { type: "string" },
          denominator: { type: "string" },
        },
        required: ["numerator", "denominator"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
