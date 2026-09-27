import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  valueLiteral: string;
  uncertaintyDigits: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "valueLiteral", label: "Value literal", kind: "string" },
  { id: "uncertaintyDigits", label: "Uncertainty digits", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    /^[+-]?\d{1,12}(?:\.\d{1,12})?(?![\s\S])/.test(i.valueLiteral) &&
      /^\d{1,6}(?![\s\S])/.test(i.uncertaintyDigits),
  );
  const places = i.valueLiteral.split(".")[1]?.length ?? 0;
  return H.finish({
    label: i.valueLiteral + "(" + i.uncertaintyDigits + ")",
    absoluteUncertainty: Number(i.uncertaintyDigits) * 10 ** -places,
  });
};
export const example = {
  input: { valueLiteral: "1.230", uncertaintyDigits: "12" },
  output: { result: { label: "1.230(12)", absoluteUncertainty: 0.012 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/decimal-uncertainty-last-place-label",
  title: "Formatting: Decimal Uncertainty Last Place Label Tool",
  description:
    "Format absolute uncertainty in parentheses at the last explicitly retained decimal place; accepts fixed decimal literals only, not significant-figure inference.",
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
          absoluteUncertainty: { type: "number" },
          label: { type: "string" },
        },
        required: ["absoluteUncertainty", "label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
