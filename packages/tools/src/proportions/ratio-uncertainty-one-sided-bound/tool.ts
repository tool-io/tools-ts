import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  numeratorLower: number;
  numeratorUpper: number;
  denominatorLower: number;
  denominatorUpper: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "numeratorLower", label: "Numerator lower", kind: "number" },
  { id: "numeratorUpper", label: "Numerator upper", kind: "number" },
  { id: "denominatorLower", label: "Denominator lower", kind: "number" },
  { id: "denominatorUpper", label: "Denominator upper", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.numeratorLower <= i.numeratorUpper &&
      i.denominatorLower <= i.denominatorUpper &&
      (i.denominatorLower > 0 || i.denominatorUpper < 0),
  );
  const ratios = [
    i.numeratorLower / i.denominatorLower,
    i.numeratorLower / i.denominatorUpper,
    i.numeratorUpper / i.denominatorLower,
    i.numeratorUpper / i.denominatorUpper,
  ];
  return H.finish({
    ratioLower: Math.min(...ratios),
    ratioUpper: Math.max(...ratios),
    denominatorSign: i.denominatorLower > 0 ? "positive" : "negative",
  });
};
export const example = {
  input: {
    numeratorLower: 2,
    numeratorUpper: 4,
    denominatorLower: 1,
    denominatorUpper: 2,
  },
  output: {
    result: { ratioLower: 1, ratioUpper: 4, denominatorSign: "positive" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proportions/ratio-uncertainty-one-sided-bound",
  title: "Proportions: Ratio Uncertainty One Sided Bound Tool",
  description:
    "Bound a ratio over explicit ordered closed numerator/denominator intervals that do not include zero; all four endpoint ratios establish monotone bounds.",
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
          denominatorSign: { type: "string" },
          ratioLower: { type: "number" },
          ratioUpper: { type: "number" },
        },
        required: ["denominatorSign", "ratioLower", "ratioUpper"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
