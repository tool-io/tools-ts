import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly standbyPatronIds: readonly string[];
  readonly callerPriorityNumbers: readonly number[];
  readonly callerEligibilityFlags: readonly number[];
  readonly independentlyReleasedSeatCount: number;
}>;
export type Output = Readonly<{
  readonly plannedStandbyAdmissionIds: readonly string[];
  readonly eligibleWaitlistedPatronIds: readonly string[];
  readonly ineligiblePatronIds: readonly string[];
}>;
const inputFields = [
  { id: "standbyPatronIds", label: "Standby patron ids", kind: "stringList" },
  {
    id: "callerPriorityNumbers",
    label: "Caller priority numbers",
    kind: "numberList",
  },
  {
    id: "callerEligibilityFlags",
    label: "Caller eligibility flags",
    kind: "numberList",
  },
  {
    id: "independentlyReleasedSeatCount",
    label: "Independently released seat count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.standbyPatronIds, "patrons");
  aligned(input.standbyPatronIds, input.callerPriorityNumbers, "priority");
  aligned(input.standbyPatronIds, input.callerEligibilityFlags, "eligibility");
  binary(input.callerEligibilityFlags, "eligibility");
  input.callerPriorityNumbers.forEach((v) =>
    bounded(v, "priority", 0, 1000000),
  );
  bounded(input.independentlyReleasedSeatCount, "seats", 0, 1000000);
  const order = input.standbyPatronIds
    .map((_, i) => i)
    .filter((i) => input.callerEligibilityFlags[i] === 1)
    .sort(
      (a, b) =>
        input.callerPriorityNumbers[a] - input.callerPriorityNumbers[b] ||
        a - b,
    );
  return {
    plannedStandbyAdmissionIds: order
      .slice(0, input.independentlyReleasedSeatCount)
      .map((i) => input.standbyPatronIds[i]),
    eligibleWaitlistedPatronIds: order
      .slice(input.independentlyReleasedSeatCount)
      .map((i) => input.standbyPatronIds[i]),
    ineligiblePatronIds: input.standbyPatronIds.filter(
      (_, i) => !input.callerEligibilityFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  standbyPatronIds: ["A", "B", "C"],
  callerPriorityNumbers: [2, 1, 1],
  callerEligibilityFlags: [1, 1, 0],
  independentlyReleasedSeatCount: 1,
} satisfies Input;
export const exampleOutput = {
  plannedStandbyAdmissionIds: ["B"],
  eligibleWaitlistedPatronIds: ["A"],
  ineligiblePatronIds: ["C"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/sold-out-standby-admission-policy-lookup",
  title: "Sold Out Standby Admission Policy Lookup",
  description:
    "Plan actual eligible standby queue against independently released seats with stable caller-priority ties; no inference no-show seats are available, automatic ticket admission or universal house policy.",
  inputs: inputFields,
  outputs: [
    {
      id: "plannedStandbyAdmissionIds",
      label: "Planned standby admission ids",
      kind: "stringList",
    },
    {
      id: "eligibleWaitlistedPatronIds",
      label: "Eligible waitlisted patron ids",
      kind: "stringList",
    },
    {
      id: "ineligiblePatronIds",
      label: "Ineligible patron ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      standbyPatronIds: value.standbyPatronIds as readonly string[],
      callerPriorityNumbers: value.callerPriorityNumbers as readonly number[],
      callerEligibilityFlags: value.callerEligibilityFlags as readonly number[],
      independentlyReleasedSeatCount:
        value.independentlyReleasedSeatCount as number,
    }),
});
export const run = tool.execute;
export default tool;
