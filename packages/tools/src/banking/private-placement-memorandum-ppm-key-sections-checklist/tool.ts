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
      "issuer and offering terms documented",
      "risk factors documented",
      "use of proceeds documented",
      "fees and conflicts documented",
      "investor rights and subscription terms documented",
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
        "issuer and offering terms documented",
        "risk factors documented",
        "use of proceeds documented",
        "fees and conflicts documented",
        "investor rights and subscription terms documented",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/private-placement-memorandum-ppm-key-sections-checklist",
  title: "Private Placement Memorandum PPM Key Sections Checklist",
  description:
    "Record a bounded PPM review subset, not complete legal adequacy or approval of an offering. Independently witnessed columns in order: issuer and offering terms documented, risk factors documented, use of proceeds documented, fees and conflicts documented, investor rights and subscription terms documented. Missing and unknown remain distinct; this is not legal compliance, coverage, authenticity or safety certification.",
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
