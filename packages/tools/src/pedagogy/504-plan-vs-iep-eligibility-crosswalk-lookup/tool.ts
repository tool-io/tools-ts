import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerified504IepEligibilityKeys: readonly string[];
  readonly callerVerified504IepEligibilityNotices: readonly string[];
  readonly query504IepEligibilityKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerified504IepEligibilityKeys",
    label: "Caller verified504 iep eligibility keys",
    kind: "stringList",
  },
  {
    id: "callerVerified504IepEligibilityNotices",
    label: "Caller verified504 iep eligibility notices",
    kind: "stringList",
  },
  {
    id: "query504IepEligibilityKey",
    label: "Query504 iep eligibility key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerified504IepEligibilityKeys,
      input.callerVerified504IepEligibilityNotices,
      input.query504IepEligibilityKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerified504IepEligibilityKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerified504IepEligibilityNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  query504IepEligibilityKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/504-plan-vs-iep-eligibility-crosswalk-lookup",
  title: "504 Plan vs IEP Eligibility Crosswalk Lookup",
  description:
    "Caller independently verified jurisdiction/date individual 504/IDEA eligibility and procedural crosswalk, no diagnosis-only eligibility or substituting checklist for due process. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerified504IepEligibilityKeys:
        value.callerVerified504IepEligibilityKeys as readonly string[],
      callerVerified504IepEligibilityNotices:
        value.callerVerified504IepEligibilityNotices as readonly string[],
      query504IepEligibilityKey: value.query504IepEligibilityKey as string,
    }),
});
export const run = tool.execute;
export default tool;
