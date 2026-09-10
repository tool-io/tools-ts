import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualNewUniqueMappedLengthMeters: number;
  readonly actualSurveySessionCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNewUniqueMappedLengthMeters",
    label: "Actual new unique mapped length meters",
    kind: "number",
  },
  {
    id: "actualSurveySessionCount",
    label: "Actual survey session count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualNewUniqueMappedLengthMeters, "numerator");
  positive(input.actualSurveySessionCount, "denominator");
  return {
    observedRatio:
      (1 * input.actualNewUniqueMappedLengthMeters) /
      input.actualSurveySessionCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualNewUniqueMappedLengthMeters: 2, actualSurveySessionCount: 4 },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/mapped-length-per-session",
  title: "Mapped Length per Session Productivity Calculator",
  description:
    "Actual unique newly surveyed length per completed survey session, not resurvey coverage doublecounted. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
