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
      "repository independently present",
      "title independently present",
      "date independently present",
      "extent independently present",
      "creator identification independently assessed",
      "scope/content independently present",
      "access conditions independently present",
      "language information independently present",
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
    observedCriterionFlags: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    criterionKnownFlags: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "reference code independently present",
        "repository independently present",
        "title independently present",
        "date independently present",
        "extent independently present",
        "creator identification independently assessed",
        "scope/content independently present",
        "access conditions independently present",
        "language information independently present",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/dacs-minimum-elements-checker",
  title: "DACS Minimum Elements Compliance Checker",
  description:
    "DACS single-level minimum-description presence audit under caller independently verified edition/context. Creator/domain applicability and exceptions require actual review; presence alone not DACS semantic compliance. Independently witnessed columns in order: reference code independently present, repository independently present, title independently present, date independently present, extent independently present, creator identification independently assessed, scope/content independently present, access conditions independently present, language information independently present. Known missing and unknown evidence stay distinct; not approval, compliance, readiness, authenticity or safety certification.",
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
