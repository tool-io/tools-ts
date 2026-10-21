import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, surveyRatio } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedLegalDivorceEvents: readonly number[];
  readonly matchedMidyearPopulation: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "observedLegalDivorceEvents",
    label: "Observed legal divorce events",
    kind: "numberList",
  },
  {
    id: "matchedMidyearPopulation",
    label: "Matched midyear population",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return surveyRatio(
    input.observedLegalDivorceEvents,
    input.matchedMidyearPopulation,
    1000,
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedLegalDivorceEvents: [2, 4],
    matchedMidyearPopulation: [10, 20],
  },
  output: {
    result: {
      observedPooledRate: 200.0,
      observedNumeratorTotal: 6,
      observedDenominatorTotal: 30,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/divorce-rate-crude",
  title: "Crude Divorce Rate Calculator",
  description:
    "Crude divorce events per1000population-person-years, not individual divorce probability. Actual aligned same-period numerator/denominator strata, pooled by exposure not unweighted mean. Nonnegative counts/exposures and positive total denominator; overlapping strata must be independently resolved. No cohort representativeness, causation or eligibility inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedPooledRate: { type: "number" },
          observedNumeratorTotal: { type: "number" },
          observedDenominatorTotal: { type: "number" },
        },
        required: [
          "observedPooledRate",
          "observedNumeratorTotal",
          "observedDenominatorTotal",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
