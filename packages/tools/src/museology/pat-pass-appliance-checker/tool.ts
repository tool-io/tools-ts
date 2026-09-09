import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  annotatedChecklist,
} from "../batch46-shared.js";
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
      "independently verified electrical appliance identity",
      "independently verified portable-appliance test report",
      "test scope and result independently reviewed",
      "current use context/inspection independently reviewed",
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
    observedCriterionFlags: [1, 1, 1, 1],
    criterionKnownFlags: [1, 1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "independently verified electrical appliance identity",
        "independently verified portable-appliance test report",
        "test scope and result independently reviewed",
        "current use context/inspection independently reviewed",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/pat-pass-appliance-checker",
  title: "PAT Pass Electrical Exhibit Appliance Checker",
  description:
    "Electrical PAT record review, not Photographic Activity Test, perform an electrical test or prove an exhibit appliance safe/currently compliant. Independently witnessed columns in order: independently verified electrical appliance identity, independently verified portable-appliance test report, test scope and result independently reviewed, current use context/inspection independently reviewed. Known missing and unknown evidence stay distinct; not approval, compliance, readiness, authenticity or safety certification.",
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
