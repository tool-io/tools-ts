import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  earned: number;
  ordinaryMaximum: number;
  extraEarned: number;
  extraMaximum: number;
  policy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "earned", label: "Earned", kind: "number" },
  { id: "ordinaryMaximum", label: "Ordinary maximum", kind: "number" },
  { id: "extraEarned", label: "Extra earned", kind: "number" },
  { id: "extraMaximum", label: "Extra maximum", kind: "number" },
  {
    id: "policy",
    label: "Policy",
    kind: "string",
    enum: ["exclude-extra-maximum", "include-extra-maximum"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.ordinaryMaximum >= 0 &&
      i.extraMaximum >= 0 &&
      i.earned >= 0 &&
      i.earned <= i.ordinaryMaximum &&
      i.extraEarned >= 0 &&
      i.extraEarned <= i.extraMaximum,
  );
  H.choice(i.policy, ["exclude-extra-maximum", "include-extra-maximum"]);
  const den =
    i.ordinaryMaximum +
    (i.policy === "include-extra-maximum" ? i.extraMaximum : 0);
  return H.finish({
    denominator: den,
    gradeFraction: den === 0 ? 0 : (i.earned + i.extraEarned) / den,
    defined: den !== 0,
  });
};
export const example = {
  input: {
    earned: 8,
    ordinaryMaximum: 10,
    extraEarned: 2,
    extraMaximum: 2,
    policy: "exclude-extra-maximum",
  },
  output: { result: { denominator: 10, gradeFraction: 1, defined: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "education/grade-extra-credit-denominator-policy",
  title: "Education: Grade Extra Credit Denominator Policy Tool",
  description:
    "Compute one grade fraction with an explicit extra-credit denominator policy; no letter-grade mapping, institutional defaults or student inference.",
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
          denominator: { type: "number" },
          gradeFraction: { type: "number" },
        },
        required: ["defined", "denominator", "gradeFraction"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
