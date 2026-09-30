import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  eligible: number;
  present: number;
  quorumNumerator: number;
  quorumDenominator: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "eligible", label: "Eligible", kind: "integer" },
  { id: "present", label: "Present", kind: "integer" },
  { id: "quorumNumerator", label: "Quorum numerator", kind: "integer" },
  { id: "quorumDenominator", label: "Quorum denominator", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.eligible, 0, 1000000);
  H.int(i.present, 0, i.eligible);
  H.int(i.quorumDenominator, 1, 1000000);
  H.int(i.quorumNumerator, 0, i.quorumDenominator);
  const required = Math.ceil(
    (i.eligible * i.quorumNumerator) / i.quorumDenominator,
  );
  return H.finish({ requiredCount: required, quorate: i.present >= required });
};
export const example = {
  input: { eligible: 7, present: 3, quorumNumerator: 1, quorumDenominator: 2 },
  output: { result: { requiredCount: 4, quorate: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "management/decision-quorum-rule-result",
  title: "Management: Decision Quorum Rule Result Tool",
  description:
    "Evaluate an explicitly supplied inclusive rational quorum rule against counts, rounding required attendance up; not a legal or institutional quorum determination.",
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
          quorate: { type: "boolean" },
          requiredCount: { type: "number" },
        },
        required: ["quorate", "requiredCount"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
