import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  sum,
  mean,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedWastewaterLitersPerDay: readonly number[];
  readonly callerRetentionDays: number;
  readonly callerSludgeReservedLiters: number;
  readonly callerEmergencyReserveLiters: number;
}>;
export type Output = Readonly<{
  readonly callerLiquidRetentionBudgetLiters: number;
  readonly callerTotalSepticTankBudgetLiters: number;
}>;
const inputFields = [
  {
    id: "observedWastewaterLitersPerDay",
    label: "Observed wastewater liters per day",
    kind: "numberList",
  },
  { id: "callerRetentionDays", label: "Caller retention days", kind: "number" },
  {
    id: "callerSludgeReservedLiters",
    label: "Caller sludge reserved liters",
    kind: "number",
  },
  {
    id: "callerEmergencyReserveLiters",
    label: "Caller emergency reserve liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWastewaterLitersPerDay.forEach((v) =>
    nonnegative(v, "observedWastewaterLitersPerDay"),
  );
  nonnegative(input.callerRetentionDays, "callerRetentionDays");
  nonnegative(input.callerSludgeReservedLiters, "callerSludgeReservedLiters");
  nonnegative(
    input.callerEmergencyReserveLiters,
    "callerEmergencyReserveLiters",
  );
  const liquid =
    mean(input.observedWastewaterLitersPerDay) * input.callerRetentionDays;
  return {
    callerLiquidRetentionBudgetLiters: liquid,
    callerTotalSepticTankBudgetLiters: sum([
      liquid,
      input.callerSludgeReservedLiters,
      input.callerEmergencyReserveLiters,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWastewaterLitersPerDay: [100, 200],
  callerRetentionDays: 2,
  callerSludgeReservedLiters: 100,
  callerEmergencyReserveLiters: 50,
} satisfies Input;
export const exampleOutput = {
  callerLiquidRetentionBudgetLiters: 300,
  callerTotalSepticTankBudgetLiters: 450,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/septic-tank-size",
  title: "Plumbing Septic Tank Size Calculator",
  description:
    "Budget actual mean wastewater observations and independent retention/sludge/emergency storage volumes; no minimum legal septic capacity, biological treatment or site approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerLiquidRetentionBudgetLiters",
      label: "Caller liquid retention budget liters",
      kind: "number",
    },
    {
      id: "callerTotalSepticTankBudgetLiters",
      label: "Caller total septic tank budget liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWastewaterLitersPerDay:
        value.observedWastewaterLitersPerDay as readonly number[],
      callerRetentionDays: value.callerRetentionDays as number,
      callerSludgeReservedLiters: value.callerSludgeReservedLiters as number,
      callerEmergencyReserveLiters:
        value.callerEmergencyReserveLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
