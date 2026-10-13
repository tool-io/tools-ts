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
export type Output = ReturnType<typeof calculate>;
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
const compute = (input: Input) => {
  return annotatedChecklist(
    [
      "independently documented pressure claim",
      "independently documented opportunity/control gap",
      "independently documented rationalization claim",
    ],
    input.observedCriterionFlags,
    input.criterionKnownFlags,
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedCriterionFlags: [1, 1, 1], criterionKnownFlags: [1, 1, 1] },
  output: {
    result: {
      witnessedCriteria: [
        "independently documented pressure claim",
        "independently documented opportunity/control gap",
        "independently documented rationalization claim",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/fraud-triangle-pressure-opportunity-rationalization-checker",
  title: "Fraud Triangle Pressure Opportunity Rationalization Checklist",
  description:
    "Fraud-triangle evidence record, not fraud diagnosis or presume intent from financial pressure. Independently witnessed columns in order: independently documented pressure claim, independently documented opportunity/control gap, independently documented rationalization claim. Known missing and unknown evidence stay distinct; not approval, compliance, readiness, authenticity or safety certification.",
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
          witnessedCriteria: { type: "array", items: { type: "string" } },
          knownMissingCriteria: { type: "array", items: { type: "string" } },
          unknownCriteria: { type: "array", items: { type: "string" } },
        },
        required: [
          "witnessedCriteria",
          "knownMissingCriteria",
          "unknownCriteria",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
