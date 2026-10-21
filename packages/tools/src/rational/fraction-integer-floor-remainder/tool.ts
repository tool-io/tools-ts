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
  const floor = H.floor(n, d);
  return H.finish({
    floor: String(floor),
    remainder: H.fraction(n - floor * d, d),
  });
};
export const example = {
  input: { numerator: "-7", denominator: "3" },
  output: {
    result: { floor: "-3", remainder: { numerator: "2", denominator: "3" } },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rational/fraction-integer-floor-remainder",
  title: "Fraction Floor and Remainder",
  description:
    "Split an exact rational into mathematical floor and a nonnegative reduced fractional remainder; signed numerators are not truncated toward zero.",
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
          floor: { type: "string" },
          remainder: {
            type: "object",
            additionalProperties: false,
            properties: {
              numerator: { type: "string" },
              denominator: { type: "string" },
            },
            required: ["numerator", "denominator"],
          },
        },
        required: ["floor", "remainder"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
