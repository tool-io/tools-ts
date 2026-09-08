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
      "actual arch/tooth measurements reviewed",
      "periodontal/skeletal constraints reviewed",
      "growth/occlusion context independently reviewed",
      "qualified shared clinical decision recorded",
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
        "actual arch/tooth measurements reviewed",
        "periodontal/skeletal constraints reviewed",
        "growth/occlusion context independently reviewed",
        "qualified shared clinical decision recorded",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/extraction-vs-expansion-checker",
  title: "Extraction vs Expansion Checker",
  description:
    "Extraction-versus-expansion evidence review only, not recommend extraction/expansion or decide a clinical plan. Independently established criterion columns: actual arch/tooth measurements reviewed, periodontal/skeletal constraints reviewed, growth/occlusion context independently reviewed, qualified shared clinical decision recorded. Unknown/missing evidence retained. Not readiness, eligibility, diagnosis, treatment, safety or compliance approval.",
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
