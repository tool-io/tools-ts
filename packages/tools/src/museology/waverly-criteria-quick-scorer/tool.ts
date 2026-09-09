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
      "national-history/life connection independently assessed",
      "outstanding aesthetic importance independently assessed",
      "outstanding research significance independently assessed",
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
  input: { observedCriterionFlags: [1, 1, 1], criterionKnownFlags: [1, 1, 1] },
  output: {
    result: {
      witnessedCriteria: [
        "national-history/life connection independently assessed",
        "outstanding aesthetic importance independently assessed",
        "outstanding research significance independently assessed",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/waverly-criteria-quick-scorer",
  title: "Waverly Criteria Points Quick Scorer",
  description:
    "Record three independently assessed Waverleycriteria premises. Correct spelling:Waverley, not Waverly. No points scheme, export-license outcome or proof at least one criterion legally met. Independently witnessed columns in order: national-history/life connection independently assessed, outstanding aesthetic importance independently assessed, outstanding research significance independently assessed. Known missing and unknown evidence stay distinct; not approval, compliance, readiness, authenticity or safety certification.",
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
