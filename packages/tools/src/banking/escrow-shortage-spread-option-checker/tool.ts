import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly projectedLowestEscrowBalanceMinor: number;
  readonly callerRequiredMinimumBalanceMinor: number;
  readonly callerSpreadMonths: number;
  readonly callerLumpSumOptionAllowed: boolean;
}>;
export type Output = Readonly<{
  readonly callerEscrowShortageMinor: number;
  readonly ceilingRoundedMonthlyShortagePaymentMinor: number;
  readonly totalSpreadCollectionMinor: number;
  readonly spreadRoundingExcessMinor: number;
  readonly availableLumpSumOptionMinor: number;
}>;
const inputFields = [
  {
    id: "projectedLowestEscrowBalanceMinor",
    label: "Projected lowest escrow balance minor",
    kind: "number",
  },
  {
    id: "callerRequiredMinimumBalanceMinor",
    label: "Caller required minimum balance minor",
    kind: "number",
  },
  { id: "callerSpreadMonths", label: "Caller spread months", kind: "number" },
  {
    id: "callerLumpSumOptionAllowed",
    label: "Caller lump sum option allowed",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.callerRequiredMinimumBalanceMinor,
    "callerRequiredMinimumBalanceMinor",
  );
  integer(
    input.projectedLowestEscrowBalanceMinor,
    "projectedLowestEscrowBalanceMinor",
  );
  bounded(input.callerSpreadMonths, "months", 1, 120);
  const shortage = money(
      Math.max(
        0,
        integer(
          input.callerRequiredMinimumBalanceMinor -
            input.projectedLowestEscrowBalanceMinor,
          "shortage",
        ),
      ),
      "shortage",
    ),
    monthly = integer(
      Number(
        (BigInt(shortage) + BigInt(input.callerSpreadMonths) - 1n) /
          BigInt(input.callerSpreadMonths),
      ),
      "monthly",
    ),
    collected = money(monthly * input.callerSpreadMonths, "collection");
  return {
    callerEscrowShortageMinor: shortage,
    ceilingRoundedMonthlyShortagePaymentMinor: monthly,
    totalSpreadCollectionMinor: collected,
    spreadRoundingExcessMinor: collected - shortage,
    availableLumpSumOptionMinor: input.callerLumpSumOptionAllowed
      ? shortage
      : -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  projectedLowestEscrowBalanceMinor: -120,
  callerRequiredMinimumBalanceMinor: 100,
  callerSpreadMonths: 12,
  callerLumpSumOptionAllowed: true,
} satisfies Input;
export const exampleOutput = {
  callerEscrowShortageMinor: 220,
  ceilingRoundedMonthlyShortagePaymentMinor: 19,
  totalSpreadCollectionMinor: 228,
  spreadRoundingExcessMinor: 8,
  availableLumpSumOptionMinor: 220,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/escrow-shortage-spread-option-checker",
  title: "Escrow Shortage Spread Option Checker",
  description:
    "Budget shortage from actual projected minimum escrow versus separately supplied required floor with caller spread/lump-sum policy and explicit ceiling rounding excess; unlike existing cushion checker, this does not derive a statutory cushion or allowable collection option.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerEscrowShortageMinor",
      label: "Caller escrow shortage minor",
      kind: "number",
    },
    {
      id: "ceilingRoundedMonthlyShortagePaymentMinor",
      label: "Ceiling rounded monthly shortage payment minor",
      kind: "number",
    },
    {
      id: "totalSpreadCollectionMinor",
      label: "Total spread collection minor",
      kind: "number",
    },
    {
      id: "spreadRoundingExcessMinor",
      label: "Spread rounding excess minor",
      kind: "number",
    },
    {
      id: "availableLumpSumOptionMinor",
      label: "Available lump sum option minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      projectedLowestEscrowBalanceMinor:
        value.projectedLowestEscrowBalanceMinor as number,
      callerRequiredMinimumBalanceMinor:
        value.callerRequiredMinimumBalanceMinor as number,
      callerSpreadMonths: value.callerSpreadMonths as number,
      callerLumpSumOptionAllowed: value.callerLumpSumOptionAllowed as boolean,
    }),
});
export const run = tool.execute;
export default tool;
