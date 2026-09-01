import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sumMoney,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedUsableSeatsByZone: readonly number[];
  readonly callerSeatsPerStaffMember: number;
  readonly callerMinimumStaffByZone: readonly number[];
  readonly alreadyAssignedStaffByZone: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredWholeStaffByZone: readonly number[];
  readonly additionalStaffNeededByZone: readonly number[];
  readonly totalRequiredStaff: number;
}>;
const inputFields = [
  {
    id: "observedUsableSeatsByZone",
    label: "Observed usable seats by zone",
    kind: "numberList",
  },
  {
    id: "callerSeatsPerStaffMember",
    label: "Caller seats per staff member",
    kind: "number",
  },
  {
    id: "callerMinimumStaffByZone",
    label: "Caller minimum staff by zone",
    kind: "numberList",
  },
  {
    id: "alreadyAssignedStaffByZone",
    label: "Already assigned staff by zone",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedUsableSeatsByZone,
    input.callerMinimumStaffByZone,
    "zones",
  );
  aligned(
    input.observedUsableSeatsByZone,
    input.alreadyAssignedStaffByZone,
    "zones",
  );
  bounded(input.callerSeatsPerStaffMember, "ratio", 1, 1000000);
  [
    ...input.observedUsableSeatsByZone,
    ...input.callerMinimumStaffByZone,
    ...input.alreadyAssignedStaffByZone,
  ].forEach((v) => bounded(v, "inventory", 0, 1000000));
  const required = input.observedUsableSeatsByZone.map((v, i) =>
    Math.max(
      input.callerMinimumStaffByZone[i],
      Math.ceil(v / input.callerSeatsPerStaffMember),
    ),
  );
  return {
    requiredWholeStaffByZone: required,
    additionalStaffNeededByZone: required.map((v, i) =>
      Math.max(0, v - input.alreadyAssignedStaffByZone[i]),
    ),
    totalRequiredStaff: sumMoney(required),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUsableSeatsByZone: [80, 120],
  callerSeatsPerStaffMember: 100,
  callerMinimumStaffByZone: [1, 1],
  alreadyAssignedStaffByZone: [1, 1],
} satisfies Input;
export const exampleOutput = {
  requiredWholeStaffByZone: [1, 2],
  additionalStaffNeededByZone: [0, 1],
  totalRequiredStaff: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/front-of-house-staff-ratio-per-100-seats",
  title: "Front Of House Staff Ratio Per 100 Seats Calculator",
  description:
    "Plan actual per-zone whole FOH staff under explicit caller ratio/minima while retaining assigned staffing gaps; not scalar staff/seat ratio, emergency capacity or legal staffing requirement.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredWholeStaffByZone",
      label: "Required whole staff by zone",
      kind: "numberList",
    },
    {
      id: "additionalStaffNeededByZone",
      label: "Additional staff needed by zone",
      kind: "numberList",
    },
    { id: "totalRequiredStaff", label: "Total required staff", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedUsableSeatsByZone:
        value.observedUsableSeatsByZone as readonly number[],
      callerSeatsPerStaffMember: value.callerSeatsPerStaffMember as number,
      callerMinimumStaffByZone:
        value.callerMinimumStaffByZone as readonly number[],
      alreadyAssignedStaffByZone:
        value.alreadyAssignedStaffByZone as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
