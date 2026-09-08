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
      "reference code independently present",
      "title independently present",
      "creator independently assessed",
      "dates independently present",
      "extent/medium independently present",
      "level of description independently present",
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
    observedCriterionFlags: [1, 1, 1, 1, 1, 1],
    criterionKnownFlags: [1, 1, 1, 1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "reference code independently present",
        "title independently present",
        "creator independently assessed",
        "dates independently present",
        "extent/medium independently present",
        "level of description independently present",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/isadg-required-field-checker",
  title: "ISAD(G) Required Field Presence Checker",
  description:
    "ISAD(G) essential exchange-element presence audit, not every 26 element, content correctness, applicable exceptions or complete standards compliance. Independently witnessed columns in order: reference code independently present, title independently present, creator independently assessed, dates independently present, extent/medium independently present, level of description independently present. Known missing and unknown evidence stay distinct; not approval, compliance, readiness, authenticity or safety certification.",
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
