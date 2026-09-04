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
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerRequiredContributorIds: readonly string[];
  readonly observedAssignmentContributorIds: readonly string[];
  readonly callerIndependentlyVerifiedSignedScopeFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly contributorsWithoutVerifiedAssignment: readonly string[];
}>;
const inputFields = [
  {
    id: "callerRequiredContributorIds",
    label: "Caller required contributor ids",
    kind: "stringList",
  },
  {
    id: "observedAssignmentContributorIds",
    label: "Observed assignment contributor ids",
    kind: "stringList",
  },
  {
    id: "callerIndependentlyVerifiedSignedScopeFlags",
    label: "Caller independently verified signed scope flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.callerIndependentlyVerifiedSignedScopeFlags,
    "callerIndependentlyVerifiedSignedScopeFlags",
  );
  if (input.observedAssignmentContributorIds.length)
    aligned(
      input.observedAssignmentContributorIds,
      input.callerIndependentlyVerifiedSignedScopeFlags,
      "observedAssignmentContributorIds",
    );
  else if (input.callerIndependentlyVerifiedSignedScopeFlags.length)
    simpleError(
      "flags",
      "Empty assignment inventory requires empty verification flags.",
    );
  unique(input.callerRequiredContributorIds, "required contributors");
  if (input.observedAssignmentContributorIds.length)
    unique(input.observedAssignmentContributorIds, "assignment contributors");
  return {
    contributorsWithoutVerifiedAssignment:
      input.callerRequiredContributorIds.filter((v) => {
        const i = input.observedAssignmentContributorIds.indexOf(v);
        return i < 0 || !input.callerIndependentlyVerifiedSignedScopeFlags[i];
      }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRequiredContributorIds: ["a", "b"],
  observedAssignmentContributorIds: ["a"],
  callerIndependentlyVerifiedSignedScopeFlags: [1],
} satisfies Input;
export const exampleOutput = {
  contributorsWithoutVerifiedAssignment: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/ip-assignment-agreement-signed-checker",
  title: "IP Assignment Agreement Signed Checker",
  description:
    "Coverage of independently scope/version/signature-verified contributor assignments, not authenticity verification from a filename or ownership/enforceability certification. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "contributorsWithoutVerifiedAssignment",
      label: "Contributors without verified assignment",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRequiredContributorIds:
        value.callerRequiredContributorIds as readonly string[],
      observedAssignmentContributorIds:
        value.observedAssignmentContributorIds as readonly string[],
      callerIndependentlyVerifiedSignedScopeFlags:
        value.callerIndependentlyVerifiedSignedScopeFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
