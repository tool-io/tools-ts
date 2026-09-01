import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly crewMemberIds: readonly string[];
  readonly observedLoadInHours: readonly number[];
  readonly observedLoadOutHours: readonly number[];
  readonly callerMinimumPaidCallHours: number;
}>;
export type Output = Readonly<{
  readonly loadInPaidHoursByMember: readonly number[];
  readonly loadOutPaidHoursByMember: readonly number[];
  readonly totalPaidCrewHours: number;
  readonly actualWorkedCrewHours: number;
}>;
const inputFields = [
  { id: "crewMemberIds", label: "Crew member ids", kind: "stringList" },
  {
    id: "observedLoadInHours",
    label: "Observed load in hours",
    kind: "numberList",
  },
  {
    id: "observedLoadOutHours",
    label: "Observed load out hours",
    kind: "numberList",
  },
  {
    id: "callerMinimumPaidCallHours",
    label: "Caller minimum paid call hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLoadInHours.forEach((v) =>
    nonnegative(v, "observedLoadInHours"),
  );
  input.observedLoadOutHours.forEach((v) =>
    nonnegative(v, "observedLoadOutHours"),
  );
  nonnegative(input.callerMinimumPaidCallHours, "callerMinimumPaidCallHours");
  aligned(input.crewMemberIds, input.observedLoadInHours, "crewMemberIds");
  aligned(input.crewMemberIds, input.observedLoadOutHours, "crewMemberIds");
  unique(input.crewMemberIds, "crew");
  const charge = (v: number) =>
      v === 0 ? 0 : Math.max(v, input.callerMinimumPaidCallHours),
    inHours = input.observedLoadInHours.map(charge),
    outHours = input.observedLoadOutHours.map(charge);
  return {
    loadInPaidHoursByMember: inHours,
    loadOutPaidHoursByMember: outHours,
    totalPaidCrewHours: sum(inHours) + sum(outHours),
    actualWorkedCrewHours:
      sum(input.observedLoadInHours) + sum(input.observedLoadOutHours),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  crewMemberIds: ["A", "B"],
  observedLoadInHours: [2, 5],
  observedLoadOutHours: [1, 2],
  callerMinimumPaidCallHours: 4,
} satisfies Input;
export const exampleOutput = {
  loadInPaidHoursByMember: [4, 5],
  loadOutPaidHoursByMember: [4, 4],
  totalPaidCrewHours: 17,
  actualWorkedCrewHours: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/stagehand-call-hours-load-in-out-estimator",
  title: "Stagehand Call Hours Load In Out Estimator",
  description:
    "Reconcile actual separate load-in/out worked calls and caller minimum paid hours, zero uncalled phases remain zero; not invented IATSE minimum, overtime/break scheduling, wages or legality.",
  inputs: inputFields,
  outputs: [
    {
      id: "loadInPaidHoursByMember",
      label: "Load in paid hours by member",
      kind: "numberList",
    },
    {
      id: "loadOutPaidHoursByMember",
      label: "Load out paid hours by member",
      kind: "numberList",
    },
    {
      id: "totalPaidCrewHours",
      label: "Total paid crew hours",
      kind: "number",
    },
    {
      id: "actualWorkedCrewHours",
      label: "Actual worked crew hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      crewMemberIds: value.crewMemberIds as readonly string[],
      observedLoadInHours: value.observedLoadInHours as readonly number[],
      observedLoadOutHours: value.observedLoadOutHours as readonly number[],
      callerMinimumPaidCallHours: value.callerMinimumPaidCallHours as number,
    }),
});
export const run = tool.execute;
export default tool;
