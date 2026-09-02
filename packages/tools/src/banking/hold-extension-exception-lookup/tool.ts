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
  readonly callerHoldExceptionFlagIds: readonly string[];
  readonly observedHoldExceptionPositiveFlags: readonly number[];
  readonly knownHoldExceptionEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownPositiveFlagIds: readonly string[];
  readonly unknownEvidenceFlagIds: readonly string[];
  readonly callerReviewTriggered: boolean;
}>;
const inputFields = [
  {
    id: "callerHoldExceptionFlagIds",
    label: "Caller hold exception flag ids",
    kind: "stringList",
  },
  {
    id: "observedHoldExceptionPositiveFlags",
    label: "Observed hold exception positive flags",
    kind: "numberList",
  },
  {
    id: "knownHoldExceptionEvidenceFlags",
    label: "Known hold exception evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerHoldExceptionFlagIds, "flags");
  aligned(
    input.callerHoldExceptionFlagIds,
    input.observedHoldExceptionPositiveFlags,
    "flags",
  );
  aligned(
    input.callerHoldExceptionFlagIds,
    input.knownHoldExceptionEvidenceFlags,
    "flags",
  );
  binary(input.observedHoldExceptionPositiveFlags, "positive");
  binary(input.knownHoldExceptionEvidenceFlags, "known");
  const positive = input.callerHoldExceptionFlagIds.filter(
    (_, i) =>
      input.knownHoldExceptionEvidenceFlags[i] &&
      input.observedHoldExceptionPositiveFlags[i],
  );
  return {
    knownPositiveFlagIds: positive,
    unknownEvidenceFlagIds: input.callerHoldExceptionFlagIds.filter(
      (_, i) => !input.knownHoldExceptionEvidenceFlags[i],
    ),
    callerReviewTriggered: !!positive.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerHoldExceptionFlagIds: ["a", "b"],
  observedHoldExceptionPositiveFlags: [1, 0],
  knownHoldExceptionEvidenceFlags: [1, 0],
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
  id: "banking/hold-extension-exception-lookup",
  title: "Hold Extension Exception Lookup",
  description:
    "Screen caller independently established funds-hold exception evidence, no automatic legal extension duration or missing-as-no-exception. Unknown evidence remains distinct; no determination of unlawful conduct or actual identity. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
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
      callerHoldExceptionFlagIds:
        value.callerHoldExceptionFlagIds as readonly string[],
      observedHoldExceptionPositiveFlags:
        value.observedHoldExceptionPositiveFlags as readonly number[],
      knownHoldExceptionEvidenceFlags:
        value.knownHoldExceptionEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
