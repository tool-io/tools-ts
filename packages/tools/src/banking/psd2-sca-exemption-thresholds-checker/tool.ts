import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  shape,
  money,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly transactionMinor: number;
  readonly callerScaExemptionIds: readonly string[];
  readonly callerExemptionMaximumMinor: readonly number[];
  readonly callerAdditionalEligibilityRequiredFlags: readonly (readonly number[])[];
  readonly observedEligibilitySatisfiedFlags: readonly number[];
  readonly knownEligibilityEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerScaExemptionCandidateIds: readonly string[];
  readonly unresolvedExemptionIds: readonly string[];
}>;
const inputFields = [
  { id: "transactionMinor", label: "Transaction minor", kind: "number" },
  {
    id: "callerScaExemptionIds",
    label: "Caller sca exemption ids",
    kind: "stringList",
  },
  {
    id: "callerExemptionMaximumMinor",
    label: "Caller exemption maximum minor",
    kind: "numberList",
  },
  {
    id: "callerAdditionalEligibilityRequiredFlags",
    label: "Caller additional eligibility required flags",
    kind: "matrix",
  },
  {
    id: "observedEligibilitySatisfiedFlags",
    label: "Observed eligibility satisfied flags",
    kind: "numberList",
  },
  {
    id: "knownEligibilityEvidenceFlags",
    label: "Known eligibility evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.transactionMinor);
  unique(input.callerScaExemptionIds, "exemptions");
  aligned(
    input.callerScaExemptionIds,
    input.callerExemptionMaximumMinor,
    "limits",
  );
  aligned(
    input.callerScaExemptionIds,
    input.callerAdditionalEligibilityRequiredFlags,
    "criteria",
  );
  input.callerExemptionMaximumMinor.forEach((v) => money(v));
  const width = shape(
    input.callerAdditionalEligibilityRequiredFlags,
    "criteria",
  );
  if (
    width !== input.observedEligibilitySatisfiedFlags.length ||
    width !== input.knownEligibilityEvidenceFlags.length
  )
    simpleError("criteria", "Aligned eligibility evidence required.");
  binary(input.observedEligibilitySatisfiedFlags, "satisfied");
  binary(input.knownEligibilityEvidenceFlags, "known");
  input.callerAdditionalEligibilityRequiredFlags.forEach((r) =>
    binary(r, "required"),
  );
  const candidate: string[] = [],
    unknown: string[] = [];
  input.callerAdditionalEligibilityRequiredFlags.forEach((r, i) => {
    if (input.transactionMinor > input.callerExemptionMaximumMinor[i]) return;
    if (
      r.some(
        (v, j) =>
          v &&
          input.knownEligibilityEvidenceFlags[j] &&
          !input.observedEligibilitySatisfiedFlags[j],
      )
    )
      return;
    if (r.some((v, j) => v && !input.knownEligibilityEvidenceFlags[j]))
      unknown.push(input.callerScaExemptionIds[i]);
    else candidate.push(input.callerScaExemptionIds[i]);
  });
  return {
    callerScaExemptionCandidateIds: candidate,
    unresolvedExemptionIds: unknown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  transactionMinor: 1000,
  callerScaExemptionIds: ["low-value", "tra"],
  callerExemptionMaximumMinor: [2000, 5000],
  callerAdditionalEligibilityRequiredFlags: [
    [1, 0],
    [1, 1],
  ],
  observedEligibilitySatisfiedFlags: [1, 0],
  knownEligibilityEvidenceFlags: [1, 1],
} satisfies Input;
export const exampleOutput = {
  callerScaExemptionCandidateIds: ["low-value"],
  unresolvedExemptionIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/psd2-sca-exemption-thresholds-checker",
  title: "PSD2 SCA Exemption Thresholds Checker",
  description:
    "Screen transaction against caller PSD2 SCA exemption monetary AND independently verified extra eligibility policies; candidate not bank acceptance. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerScaExemptionCandidateIds",
      label: "Caller sca exemption candidate ids",
      kind: "stringList",
    },
    {
      id: "unresolvedExemptionIds",
      label: "Unresolved exemption ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      transactionMinor: value.transactionMinor as number,
      callerScaExemptionIds: value.callerScaExemptionIds as readonly string[],
      callerExemptionMaximumMinor:
        value.callerExemptionMaximumMinor as readonly number[],
      callerAdditionalEligibilityRequiredFlags:
        value.callerAdditionalEligibilityRequiredFlags as readonly (readonly number[])[],
      observedEligibilitySatisfiedFlags:
        value.observedEligibilitySatisfiedFlags as readonly number[],
      knownEligibilityEvidenceFlags:
        value.knownEligibilityEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
