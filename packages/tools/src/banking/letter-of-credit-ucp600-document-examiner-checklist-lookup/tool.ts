import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  annotatedChecklist,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly observedCriterionFlags: readonly number[];
  readonly criterionKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedCriterionFlags",
    label: "Observed criterion flags",
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
      "applicable credit/UCP edition identified",
      "presentation timing independently checked",
      "required documents enumerated",
      "facial consistency independently reviewed",
      "discrepancies recorded",
    ],
    input.observedCriterionFlags,
    input.criterionKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedCriterionFlags: [1, 1, 1, 1, 1],
    criterionKnownFlags: [1, 1, 1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "applicable credit/UCP edition identified",
        "presentation timing independently checked",
        "required documents enumerated",
        "facial consistency independently reviewed",
        "discrepancies recorded",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/letter-of-credit-ucp600-document-examiner-checklist-lookup",
  title: "Letter of Credit UCP600 Document Examiner Checklist Lookup",
  description:
    "Restricted documentary-credit examination evidence under independently established UCP600credit terms; not document authentication or guaranteed payment. Independently witnessed columns in order: applicable credit/UCP edition identified, presentation timing independently checked, required documents enumerated, facial consistency independently reviewed, discrepancies recorded. Missing and unknown remain distinct; this is not legal compliance, coverage, authenticity or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
