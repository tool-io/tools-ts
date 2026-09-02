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
  readonly callerPepRoleFlagIds: readonly string[];
  readonly observedPepRolePositiveFlags: readonly number[];
  readonly knownPepRoleEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownPositiveFlagIds: readonly string[];
  readonly unknownEvidenceFlagIds: readonly string[];
  readonly callerReviewTriggered: boolean;
}>;
const inputFields = [
  {
    id: "callerPepRoleFlagIds",
    label: "Caller pep role flag ids",
    kind: "stringList",
  },
  {
    id: "observedPepRolePositiveFlags",
    label: "Observed pep role positive flags",
    kind: "numberList",
  },
  {
    id: "knownPepRoleEvidenceFlags",
    label: "Known pep role evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerPepRoleFlagIds, "flags");
  aligned(
    input.callerPepRoleFlagIds,
    input.observedPepRolePositiveFlags,
    "flags",
  );
  aligned(input.callerPepRoleFlagIds, input.knownPepRoleEvidenceFlags, "flags");
  binary(input.observedPepRolePositiveFlags, "positive");
  binary(input.knownPepRoleEvidenceFlags, "known");
  const positive = input.callerPepRoleFlagIds.filter(
    (_, i) =>
      input.knownPepRoleEvidenceFlags[i] &&
      input.observedPepRolePositiveFlags[i],
  );
  return {
    knownPositiveFlagIds: positive,
    unknownEvidenceFlagIds: input.callerPepRoleFlagIds.filter(
      (_, i) => !input.knownPepRoleEvidenceFlags[i],
    ),
    callerReviewTriggered: !!positive.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPepRoleFlagIds: ["a", "b"],
  observedPepRolePositiveFlags: [1, 0],
  knownPepRoleEvidenceFlags: [1, 0],
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
  id: "banking/pep-flag-checker",
  title: "PEP Flag Checker",
  description:
    "Screen independently verified caller PEP role/relationship evidence, no name-match identification or universal family/associate rule. Unknown evidence remains distinct; no determination of unlawful conduct or actual identity. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
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
      callerPepRoleFlagIds: value.callerPepRoleFlagIds as readonly string[],
      observedPepRolePositiveFlags:
        value.observedPepRolePositiveFlags as readonly number[],
      knownPepRoleEvidenceFlags:
        value.knownPepRoleEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
