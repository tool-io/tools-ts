import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  annotatedChecklist,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyWitnessedCriterionFlags: readonly number[];
  readonly criterionEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyWitnessedCriterionFlags",
    label: "Independently witnessed criterion flags",
    kind: "numberList",
  },
  {
    id: "criterionEvidenceKnownFlags",
    label: "Criterion evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return annotatedChecklist(
    [
      "actual guano disturbance reported",
      "actual airborne dust exposure reported",
      "qualified occupational/medical risk review recorded",
    ],
    input.independentlyWitnessedCriterionFlags,
    input.criterionEvidenceKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyWitnessedCriterionFlags: [1, 1, 1],
    criterionEvidenceKnownFlags: [1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "actual guano disturbance reported",
        "actual airborne dust exposure reported",
        "qualified occupational/medical risk review recorded",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/histoplasmosis-risk-flag",
  title: "Histoplasmosis Risk Guano Disturbance Flag Checker",
  description:
    "Histoplasmosis exposure evidence inventory only, no prediction of infection, dismissal of risk, PPEprescription or permission to disturb guano. Actual independently witnessed criterion columns: actual guano disturbance reported, actual airborne dust exposure reported, qualified occupational/medical risk review recorded. Unknowns retained; not readiness, authenticity, legality, diagnosis or safety certification.",
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
