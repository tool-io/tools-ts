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
      "reported trust breach evidence",
      "reported ongoing attachment-related distress evidence",
      "qualified consent-based professional assessment evidence",
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
        "reported trust breach evidence",
        "reported ongoing attachment-related distress evidence",
        "qualified consent-based professional assessment evidence",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/attachment-injury-checker",
  title: "Attachment Injury Checker",
  description:
    "Attachment-injury reported-evidence inventory only, unknown evidence retained; not diagnose partner behavior or infer causality. Actual independently witnessed criterion columns: reported trust breach evidence, reported ongoing attachment-related distress evidence, qualified consent-based professional assessment evidence. Unknowns retained; not readiness, authenticity, legality, diagnosis or safety certification.",
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
