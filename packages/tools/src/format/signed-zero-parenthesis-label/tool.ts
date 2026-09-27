import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ literal: string; negativeStyle: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "literal", label: "Literal", kind: "string" },
  {
    id: "negativeStyle",
    label: "Negative style",
    kind: "string",
    enum: ["minus", "parentheses"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^[+-]?\d{1,24}(?:\.\d{1,24})?(?![\s\S])/.test(i.literal));
  H.choice(i.negativeStyle, ["minus", "parentheses"]);
  const negative = i.literal.startsWith("-"),
    unsigned = i.literal.replace(/^[+-]/, "");
  return H.finish({
    label: negative
      ? i.negativeStyle === "parentheses"
        ? "(" + unsigned + ")"
        : "-" + unsigned
      : unsigned,
    negativeZero: negative && Number(unsigned) === 0,
  });
};
export const example = {
  input: { literal: "-0.00", negativeStyle: "parentheses" },
  output: { result: { label: "(0.00)", negativeZero: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/signed-zero-parenthesis-label",
  title: "Formatting: Signed Zero Parenthesis Label Tool",
  description:
    "Format a fixed-decimal sign lexically, preserving written negative zero and decimal places under minus or accounting parentheses.",
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
          label: { type: "string" },
          negativeZero: { type: "boolean" },
        },
        required: ["label", "negativeZero"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
