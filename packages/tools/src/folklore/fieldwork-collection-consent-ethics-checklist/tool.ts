import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  annotatedChecklist,
} from "../batch44-shared.js";

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
      "informed consent independently recorded",
      "withdrawal terms communicated",
      "community permissions independently established",
      "data handling and access independently reviewed",
      "attribution/anonymity choices recorded",
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
        "informed consent independently recorded",
        "withdrawal terms communicated",
        "community permissions independently established",
        "data handling and access independently reviewed",
        "attribution/anonymity choices recorded",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/fieldwork-collection-consent-ethics-checklist",
  title: "Fieldwork Collection Consent Ethics Checklist",
  description:
    "Record caller fieldwork consent/collection ethics evidence, not legal compliance or approval when any criterion is unknown. Community-specific restrictions prevail. Independently established criterion columns: informed consent independently recorded, withdrawal terms communicated, community permissions independently established, data handling and access independently reviewed, attribution/anonymity choices recorded. No certification or invented missing evidence.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
