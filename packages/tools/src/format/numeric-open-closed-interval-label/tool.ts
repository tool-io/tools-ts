import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  lower: number;
  upper: number;
  lowerClosed: boolean;
  upperClosed: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lower", label: "Lower", kind: "number" },
  { id: "upper", label: "Upper", kind: "number" },
  { id: "lowerClosed", label: "Lower closed", kind: "boolean" },
  { id: "upperClosed", label: "Upper closed", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.lower <= i.upper);
  return H.finish({
    label:
      (i.lowerClosed ? "[" : "(") +
      i.lower +
      ", " +
      i.upper +
      (i.upperClosed ? "]" : ")"),
    empty: i.lower === i.upper && !(i.lowerClosed && i.upperClosed),
  });
};
export const example = {
  input: { lower: 1, upper: 2, lowerClosed: true, upperClosed: false },
  output: { result: { label: "[1, 2)", empty: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/numeric-open-closed-interval-label",
  title: "Formatting: Numeric Open Closed Interval Label Tool",
  description:
    "Format finite numeric interval endpoints and explicit inclusion marks while identifying empty equal-endpoint intervals; no implicit infinity notation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { empty: { type: "boolean" }, label: { type: "string" } },
        required: ["empty", "label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
