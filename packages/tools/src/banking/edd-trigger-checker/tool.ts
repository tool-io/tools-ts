import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerEddTriggerFlagIds: readonly string[];
  readonly observedEddTriggerPositiveFlags: readonly number[];
  readonly knownEddTriggerEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownPositiveFlagIds: readonly string[];
  readonly unknownEvidenceFlagIds: readonly string[];
  readonly callerReviewTriggered: boolean;
}>;
const inputFields = [
  {
    id: "callerEddTriggerFlagIds",
    label: "Caller edd trigger flag ids",
    kind: "stringList",
  },
  {
    id: "observedEddTriggerPositiveFlags",
    label: "Observed edd trigger positive flags",
    kind: "numberList",
  },
  {
    id: "knownEddTriggerEvidenceFlags",
    label: "Known edd trigger evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerEddTriggerFlagIds, "flags");
  aligned(
    input.callerEddTriggerFlagIds,
    input.observedEddTriggerPositiveFlags,
    "flags",
  );
  aligned(
    input.callerEddTriggerFlagIds,
    input.knownEddTriggerEvidenceFlags,
    "flags",
  );
  binary(input.observedEddTriggerPositiveFlags, "positive");
  binary(input.knownEddTriggerEvidenceFlags, "known");
  const positive = input.callerEddTriggerFlagIds.filter(
    (_, i) =>
      input.knownEddTriggerEvidenceFlags[i] &&
      input.observedEddTriggerPositiveFlags[i],
  );
  return {
    knownPositiveFlagIds: positive,
    unknownEvidenceFlagIds: input.callerEddTriggerFlagIds.filter(
      (_, i) => !input.knownEddTriggerEvidenceFlags[i],
    ),
    callerReviewTriggered: !!positive.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEddTriggerFlagIds: ["a", "b"],
  observedEddTriggerPositiveFlags: [1, 0],
  knownEddTriggerEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownPositiveFlagIds: ["a"],
  unknownEvidenceFlagIds: ["b"],
  callerReviewTriggered: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/edd-trigger-checker",
  title: "EDD Trigger Checker",
  description:
    "Screen independently caller verified enhanced-due-diligence trigger inventory, no checklist completion substituted for trigger occurrence. Unknown evidence remains distinct; no determination of unlawful conduct or actual identity. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownPositiveFlagIds",
      label: "Known positive flag ids",
      kind: "stringList",
    },
    {
      id: "unknownEvidenceFlagIds",
      label: "Unknown evidence flag ids",
      kind: "stringList",
    },
    {
      id: "callerReviewTriggered",
      label: "Caller review triggered",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEddTriggerFlagIds:
        value.callerEddTriggerFlagIds as readonly string[],
      observedEddTriggerPositiveFlags:
        value.observedEddTriggerPositiveFlags as readonly number[],
      knownEddTriggerEvidenceFlags:
        value.knownEddTriggerEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
