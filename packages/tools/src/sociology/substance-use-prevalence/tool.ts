import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedSubstanceUseSurveyCount: number;
  readonly actualEligibleSurveyCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedSubstanceUseSurveyCount",
    label: "Actual qualified substance use survey count",
    kind: "number",
  },
  {
    id: "actualEligibleSurveyCount",
    label: "Actual eligible survey count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualQualifiedSubstanceUseSurveyCount,
    "actualQualifiedSubstanceUseSurveyCount",
    0,
    1000000,
  );
  bounded(
    input.actualEligibleSurveyCount,
    "actualEligibleSurveyCount",
    1,
    1000000,
  );
  if (
    input.actualQualifiedSubstanceUseSurveyCount >
    input.actualEligibleSurveyCount
  )
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (100 * input.actualQualifiedSubstanceUseSurveyCount) /
      input.actualEligibleSurveyCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedSubstanceUseSurveyCount: 2,
    actualEligibleSurveyCount: 4,
  },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/substance-use-prevalence",
  title: "Substance Use Prevalence Calculator",
  description:
    "Actual defined substance-use period survey percentage. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
