import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerBeatIds: readonly string[];
  readonly observedServiceWorkloadHours: readonly number[];
  readonly independentlyAvailableStaffHours: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerBeatIds", label: "Caller beat ids", kind: "stringList" },
  {
    id: "observedServiceWorkloadHours",
    label: "Observed service workload hours",
    kind: "numberList",
  },
  {
    id: "independentlyAvailableStaffHours",
    label: "Independently available staff hours",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerBeatIds, "beats");
  aligned(input.callerBeatIds, input.observedServiceWorkloadHours, "workload");
  aligned(input.callerBeatIds, input.independentlyAvailableStaffHours, "hours");
  [
    input.observedServiceWorkloadHours,
    input.independentlyAvailableStaffHours,
  ].forEach((v) => v.forEach((x) => nonnegative(x, "hours")));
  return {
    signedAvailableMinusObservedHours:
      input.independentlyAvailableStaffHours.map(
        (v, i) => v - input.observedServiceWorkloadHours[i],
      ),
    observedTotalWorkloadHours: sum(input.observedServiceWorkloadHours),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerBeatIds: ["a", "b"],
    observedServiceWorkloadHours: [1, 3],
    independentlyAvailableStaffHours: [2, 2],
  },
  output: {
    result: {
      signedAvailableMinusObservedHours: [1, -1],
      observedTotalWorkloadHours: 4,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/patrol-beat-workload-hour-balance-calculator",
  title: "Patrol Beat Workload Hour Balance Calculator",
  description:
    "Actual per-beat workload/available service-hour reconciliation, local signed shortage retained. No optimal patrol allocation, safe staffing, criminal propensity or deployment recommendation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
