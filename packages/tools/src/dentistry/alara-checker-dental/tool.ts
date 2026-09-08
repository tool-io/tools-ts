import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  annotatedChecklist,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyWitnessedCriterionFlags: readonly number[];
  readonly criterionKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyWitnessedCriterionFlags",
    label: "Independently witnessed criterion flags",
    kind: "numberList",
  },
  {
    id: "criterionKnownFlags",
    label: "Criterion known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return annotatedChecklist(
    [
      "independent clinical imaging indication reviewed",
      "existing imaging reviewed",
      "actual equipment/protocol optimization reviewed",
      "applicable current radiological guidance reviewed",
    ],
    input.independentlyWitnessedCriterionFlags,
    input.criterionKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyWitnessedCriterionFlags: [1, 1, 1, 1],
    criterionKnownFlags: [1, 1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "independent clinical imaging indication reviewed",
        "existing imaging reviewed",
        "actual equipment/protocol optimization reviewed",
        "applicable current radiological guidance reviewed",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/alara-checker-dental",
  title: "Dental ALARA Checker",
  description:
    "Dental ALARA/optimization evidence checklist, not decide an image is indicated, certify compliance or universally recommend an apron. Independently established criterion columns: independent clinical imaging indication reviewed, existing imaging reviewed, actual equipment/protocol optimization reviewed, applicable current radiological guidance reviewed. Unknown/missing evidence retained. Not readiness, eligibility, diagnosis, treatment, safety or compliance approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
