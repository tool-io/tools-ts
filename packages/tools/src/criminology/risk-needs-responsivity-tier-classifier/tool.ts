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
      "independently established assessment instrument/version",
      "independently established needs evidence",
      "responsivity/accommodation evidence",
      "qualified consent/review safeguards",
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
        "independently established assessment instrument/version",
        "independently established needs evidence",
        "responsivity/accommodation evidence",
        "qualified consent/review safeguards",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/risk-needs-responsivity-tier-classifier",
  title: "Risk Needs Responsivity Tier Classifier",
  description:
    "Bounded RNRprocess evidence record, not assign a risk tier or treatment. Independently witnessed columns in order: independently established assessment instrument/version, independently established needs evidence, responsivity/accommodation evidence, qualified consent/review safeguards. Known missing and unknown evidence stay distinct; not approval, compliance, readiness, authenticity or safety certification.",
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
