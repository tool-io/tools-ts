import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstPay: number;
  referencePay: number;
  denominator: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstPay", label: "First pay", kind: "number" },
  { id: "referencePay", label: "Reference pay", kind: "number" },
  {
    id: "denominator",
    label: "Denominator",
    kind: "string",
    enum: ["reference", "first"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.firstPay >= 0 && i.referencePay >= 0);
  H.choice(i.denominator, ["reference", "first"]);
  const den = i.denominator === "reference" ? i.referencePay : i.firstPay;
  return H.finish({
    gapFraction: den === 0 ? 0 : (i.referencePay - i.firstPay) / den,
    defined: den !== 0,
  });
};
export const example = {
  input: { firstPay: 80, referencePay: 100, denominator: "reference" },
  output: { result: { gapFraction: 0.2, defined: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gender-studies/paygap-denominator-convention-label",
  title: "Gender Studies: Paygap Denominator Convention Label Tool",
  description:
    "Report a descriptive two-pay gap under an explicitly chosen reference/first-pay denominator; no protected-attribute inference or causal pay-discrimination claim.",
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
          defined: { type: "boolean" },
          gapFraction: { type: "number" },
        },
        required: ["defined", "gapFraction"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
