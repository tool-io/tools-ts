import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  catalogIndex,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerSumpCauseIds: readonly string[];
  readonly callerVerifiedCoveredCauseFlags: readonly number[];
  readonly observedCauseIds: readonly string[];
  readonly causeEvidenceFlags: readonly number[];
  readonly callerSumpEndorsementVerified: boolean;
}>;
export type Output = Readonly<{
  readonly callerKnownUncoveredCauseIds: readonly string[];
  readonly unresolvedObservedCauseIds: readonly string[];
  readonly callerAllObservedSumpCausesResolvedCovered: boolean;
}>;
const inputFields = [
  {
    id: "callerSumpCauseIds",
    label: "Caller sump cause ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCoveredCauseFlags",
    label: "Caller verified covered cause flags",
    kind: "numberList",
  },
  { id: "observedCauseIds", label: "Observed cause ids", kind: "stringList" },
  {
    id: "causeEvidenceFlags",
    label: "Cause evidence flags",
    kind: "numberList",
  },
  {
    id: "callerSumpEndorsementVerified",
    label: "Caller sump endorsement verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerSumpCauseIds, "causes");
  aligned(
    input.callerSumpCauseIds,
    input.callerVerifiedCoveredCauseFlags,
    "catalog",
  );
  aligned(input.observedCauseIds, input.causeEvidenceFlags, "evidence");
  binary(input.callerVerifiedCoveredCauseFlags, "catalog");
  binary(input.causeEvidenceFlags, "evidence");
  const unknown = input.observedCauseIds.filter(
      (_, i) => !input.causeEvidenceFlags[i],
    ),
    notcovered = input.observedCauseIds.filter(
      (v, i) =>
        input.causeEvidenceFlags[i] &&
        (!input.callerSumpEndorsementVerified ||
          !input.callerVerifiedCoveredCauseFlags[
            catalogIndex(input.callerSumpCauseIds, v)
          ]),
    );
  input.observedCauseIds
    .filter((_, i) => input.causeEvidenceFlags[i])
    .forEach((v) => catalogIndex(input.callerSumpCauseIds, v));
  return {
    callerKnownUncoveredCauseIds: notcovered,
    unresolvedObservedCauseIds: unknown,
    callerAllObservedSumpCausesResolvedCovered:
      input.observedCauseIds.length > 0 &&
      !unknown.length &&
      !notcovered.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSumpCauseIds: ["mechanical", "power"],
  callerVerifiedCoveredCauseFlags: [1, 0],
  observedCauseIds: ["mechanical", "power"],
  causeEvidenceFlags: [1, 0],
  callerSumpEndorsementVerified: true,
} satisfies Input;
export const exampleOutput = {
  callerKnownUncoveredCauseIds: [],
  unresolvedObservedCauseIds: ["power"],
  callerAllObservedSumpCausesResolvedCovered: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/sump-overflow-coverage-checker",
  title: "Sump Overflow Coverage Checker",
  description:
    "Audit actual sump-loss cause annotations against caller independently verified endorsement cause map, unknown evidence unresolved; not causal investigation, power-failure diagnosis or coverage verdict.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerKnownUncoveredCauseIds",
      label: "Caller known uncovered cause ids",
      kind: "stringList",
    },
    {
      id: "unresolvedObservedCauseIds",
      label: "Unresolved observed cause ids",
      kind: "stringList",
    },
    {
      id: "callerAllObservedSumpCausesResolvedCovered",
      label: "Caller all observed sump causes resolved covered",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSumpCauseIds: value.callerSumpCauseIds as readonly string[],
      callerVerifiedCoveredCauseFlags:
        value.callerVerifiedCoveredCauseFlags as readonly number[],
      observedCauseIds: value.observedCauseIds as readonly string[],
      causeEvidenceFlags: value.causeEvidenceFlags as readonly number[],
      callerSumpEndorsementVerified:
        value.callerSumpEndorsementVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
