import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, compareEvidence } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerThreeDsLiabilityCriterionIds: readonly string[];
  readonly callerThreeDsLiabilityRequiredFlags: readonly number[];
  readonly observedThreeDsLiabilitySatisfiedFlags: readonly number[];
  readonly knownThreeDsLiabilityEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly missing: readonly string[];
  readonly unknown: readonly string[];
  readonly complete: boolean;
}>;
const inputFields = [
  {
    id: "callerThreeDsLiabilityCriterionIds",
    label: "Caller three ds liability criterion ids",
    kind: "stringList",
  },
  {
    id: "callerThreeDsLiabilityRequiredFlags",
    label: "Caller three ds liability required flags",
    kind: "numberList",
  },
  {
    id: "observedThreeDsLiabilitySatisfiedFlags",
    label: "Observed three ds liability satisfied flags",
    kind: "numberList",
  },
  {
    id: "knownThreeDsLiabilityEvidenceFlags",
    label: "Known three ds liability evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return compareEvidence(
    input.callerThreeDsLiabilityCriterionIds,
    input.callerThreeDsLiabilityRequiredFlags,
    input.observedThreeDsLiabilitySatisfiedFlags,
    input.knownThreeDsLiabilityEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerThreeDsLiabilityCriterionIds: ["criterion-a", "criterion-b"],
  callerThreeDsLiabilityRequiredFlags: [1, 1],
  observedThreeDsLiabilitySatisfiedFlags: [1, 0],
  knownThreeDsLiabilityEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  missing: [],
  unknown: ["criterion-b"],
  complete: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/euro-3ds-liability-shift-checker",
  title: "Euro 3DS Liability Shift Checker",
  description:
    "Evaluate explicit independently verified3DS liability-shift prerequisites by caller scheme/version/jurisdiction checklist, not authentication success alone or actual liability assignment. Missing/unknown evidence never establishes eligibility or absence of risk. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    { id: "missing", label: "Missing", kind: "stringList" },
    { id: "unknown", label: "Unknown", kind: "stringList" },
    { id: "complete", label: "Complete", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      callerThreeDsLiabilityCriterionIds:
        value.callerThreeDsLiabilityCriterionIds as readonly string[],
      callerThreeDsLiabilityRequiredFlags:
        value.callerThreeDsLiabilityRequiredFlags as readonly number[],
      observedThreeDsLiabilitySatisfiedFlags:
        value.observedThreeDsLiabilitySatisfiedFlags as readonly number[],
      knownThreeDsLiabilityEvidenceFlags:
        value.knownThreeDsLiabilityEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
