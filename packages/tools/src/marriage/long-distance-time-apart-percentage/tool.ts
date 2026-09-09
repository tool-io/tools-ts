import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyRecordedTimeApartMinutes: number;
  readonly actualCompleteRelationshipReferenceMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyRecordedTimeApartMinutes",
    label: "Actual independently recorded time apart minutes",
    kind: "number",
  },
  {
    id: "actualCompleteRelationshipReferenceMinutes",
    label: "Actual complete relationship reference minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualIndependentlyRecordedTimeApartMinutes, "numerator");
  positive(input.actualCompleteRelationshipReferenceMinutes, "denominator");
  return {
    observedRatio:
      (100 * input.actualIndependentlyRecordedTimeApartMinutes) /
      input.actualCompleteRelationshipReferenceMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyRecordedTimeApartMinutes: 2,
    actualCompleteRelationshipReferenceMinutes: 4,
  },
  output: { result: { observedRatio: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/long-distance-time-apart-percentage",
  title: "Long Distance Time Apart Percentage Calculator",
  description:
    "Actual timeapart percentage under independently defined reference period; not relationship risk prediction. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
