import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, money } from "../batch-shared.js";
export type Input = Readonly<{
  readonly wireAmountMinor: number;
  readonly callerDualApprovalThresholdMinor: number;
  readonly observedApprovalActorIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly dualApprovalRequiredByCallerPolicy: boolean;
  readonly distinctObservedApprovalActorCount: number;
  readonly satisfiesCallerDistinctApprovalCount: boolean;
}>;
const inputFields = [
  { id: "wireAmountMinor", label: "Wire amount minor", kind: "number" },
  {
    id: "callerDualApprovalThresholdMinor",
    label: "Caller dual approval threshold minor",
    kind: "number",
  },
  {
    id: "observedApprovalActorIds",
    label: "Observed approval actor ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.wireAmountMinor, "wireAmountMinor");
  money(
    input.callerDualApprovalThresholdMinor,
    "callerDualApprovalThresholdMinor",
  );
  if (input.observedApprovalActorIds.some((s) => !s.trim()))
    simpleError(
      "actors",
      "Explicit nonempty actor identifiers required; repeated records do not add approvers.",
    );
  const n = new Set(input.observedApprovalActorIds).size,
    dual = input.wireAmountMinor >= input.callerDualApprovalThresholdMinor;
  return {
    dualApprovalRequiredByCallerPolicy: dual,
    distinctObservedApprovalActorCount: n,
    satisfiesCallerDistinctApprovalCount: n >= (dual ? 2 : 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wireAmountMinor: 1000,
  callerDualApprovalThresholdMinor: 1000,
  observedApprovalActorIds: ["alice", "alice"],
} satisfies Input;
export const exampleOutput = {
  dualApprovalRequiredByCallerPolicy: true,
  distinctObservedApprovalActorCount: 1,
  satisfiesCallerDistinctApprovalCount: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/dual-authorization-wire-threshold-checker",
  title: "Dual Authorization Wire Threshold Checker",
  description:
    "Audit actual distinct wire approval identities against caller inclusive amount threshold, counting repeated same-actor records once; identity authenticity, role authority, chronology and full payment authorization remain external.",
  inputs: inputFields,
  outputs: [
    {
      id: "dualApprovalRequiredByCallerPolicy",
      label: "Dual approval required by caller policy",
      kind: "boolean",
    },
    {
      id: "distinctObservedApprovalActorCount",
      label: "Distinct observed approval actor count",
      kind: "number",
    },
    {
      id: "satisfiesCallerDistinctApprovalCount",
      label: "Satisfies caller distinct approval count",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      wireAmountMinor: value.wireAmountMinor as number,
      callerDualApprovalThresholdMinor:
        value.callerDualApprovalThresholdMinor as number,
      observedApprovalActorIds:
        value.observedApprovalActorIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
