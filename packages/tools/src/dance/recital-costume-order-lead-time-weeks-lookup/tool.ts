import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  dateDay,
  dayDate,
  sumMoney,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly recitalCivilDate: string;
  readonly callerVerifiedSupplierLeadDays: number;
  readonly callerFittingAndAlterationDays: number;
  readonly callerContingencyDays: number;
  readonly plannedOrderCivilDate: string;
}>;
export type Output = Readonly<{
  readonly latestPlannedOrderCivilDate: string;
  readonly signedOrderLeadSlackDays: number;
  readonly totalReservedLeadDays: number;
}>;
const inputFields = [
  { id: "recitalCivilDate", label: "Recital civil date", kind: "string" },
  {
    id: "callerVerifiedSupplierLeadDays",
    label: "Caller verified supplier lead days",
    kind: "number",
  },
  {
    id: "callerFittingAndAlterationDays",
    label: "Caller fitting and alteration days",
    kind: "number",
  },
  {
    id: "callerContingencyDays",
    label: "Caller contingency days",
    kind: "number",
  },
  {
    id: "plannedOrderCivilDate",
    label: "Planned order civil date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const recital = dateDay(input.recitalCivilDate),
    order = dateDay(input.plannedOrderCivilDate);
  [
    input.callerVerifiedSupplierLeadDays,
    input.callerFittingAndAlterationDays,
    input.callerContingencyDays,
  ].forEach((v) => bounded(v, "lead", 0, 366));
  const lead = sumMoney([
      input.callerVerifiedSupplierLeadDays,
      input.callerFittingAndAlterationDays,
      input.callerContingencyDays,
    ]),
    deadline = recital - lead;
  return {
    latestPlannedOrderCivilDate: dayDate(deadline),
    signedOrderLeadSlackDays: deadline - order,
    totalReservedLeadDays: lead,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  recitalCivilDate: "2026-12-01",
  callerVerifiedSupplierLeadDays: 42,
  callerFittingAndAlterationDays: 14,
  callerContingencyDays: 7,
  plannedOrderCivilDate: "2026-10-01",
} satisfies Input;
export const exampleOutput = {
  latestPlannedOrderCivilDate: "2026-09-29",
  signedOrderLeadSlackDays: -2,
  totalReservedLeadDays: 63,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/recital-costume-order-lead-time-weeks-lookup",
  title: "Recital Costume Order Lead Time Weeks Lookup",
  description:
    "Plan actual recital costume order date with independently verified supplier/fitting/contingency calendar-day components; strict ISO dates 1900–2199, not universal weeks or business-day/holiday/time-zone inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "latestPlannedOrderCivilDate",
      label: "Latest planned order civil date",
      kind: "string",
    },
    {
      id: "signedOrderLeadSlackDays",
      label: "Signed order lead slack days",
      kind: "number",
    },
    {
      id: "totalReservedLeadDays",
      label: "Total reserved lead days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      recitalCivilDate: value.recitalCivilDate as string,
      callerVerifiedSupplierLeadDays:
        value.callerVerifiedSupplierLeadDays as number,
      callerFittingAndAlterationDays:
        value.callerFittingAndAlterationDays as number,
      callerContingencyDays: value.callerContingencyDays as number,
      plannedOrderCivilDate: value.plannedOrderCivilDate as string,
    }),
});
export const run = tool.execute;
export default tool;
