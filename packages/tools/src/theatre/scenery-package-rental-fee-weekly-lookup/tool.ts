import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  bounded,
  sumMoney,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly actualRentalDays: number;
  readonly callerMinimumChargeWeeks: number;
  readonly callerWeeklyRentalMinor: number;
  readonly deliveryAndCollectionMinor: number;
  readonly refundableDepositMinor: number;
}>;
export type Output = Readonly<{
  readonly billableWholeRentalWeeks: number;
  readonly nonrefundableRentalAndDeliveryMinor: number;
  readonly totalUpfrontRentalCashMinor: number;
}>;
const inputFields = [
  { id: "actualRentalDays", label: "Actual rental days", kind: "number" },
  {
    id: "callerMinimumChargeWeeks",
    label: "Caller minimum charge weeks",
    kind: "number",
  },
  {
    id: "callerWeeklyRentalMinor",
    label: "Caller weekly rental minor",
    kind: "number",
  },
  {
    id: "deliveryAndCollectionMinor",
    label: "Delivery and collection minor",
    kind: "number",
  },
  {
    id: "refundableDepositMinor",
    label: "Refundable deposit minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.actualRentalDays, "days", 0, 3660);
  bounded(input.callerMinimumChargeWeeks, "minimum", 0, 523);
  [
    input.callerWeeklyRentalMinor,
    input.deliveryAndCollectionMinor,
    input.refundableDepositMinor,
  ].forEach((v) => bounded(v, "charge", 0, 1000000000));
  const weeks = Math.max(
      input.callerMinimumChargeWeeks,
      Math.ceil(input.actualRentalDays / 7),
    ),
    rental = integer(weeks * input.callerWeeklyRentalMinor, "rental"),
    nonrefundable = sumMoney([rental, input.deliveryAndCollectionMinor]);
  return {
    billableWholeRentalWeeks: weeks,
    nonrefundableRentalAndDeliveryMinor: nonrefundable,
    totalUpfrontRentalCashMinor: sumMoney([
      nonrefundable,
      input.refundableDepositMinor,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  actualRentalDays: 8,
  callerMinimumChargeWeeks: 1,
  callerWeeklyRentalMinor: 1000,
  deliveryAndCollectionMinor: 200,
  refundableDepositMinor: 500,
} satisfies Input;
export const exampleOutput = {
  billableWholeRentalWeeks: 2,
  nonrefundableRentalAndDeliveryMinor: 2200,
  totalUpfrontRentalCashMinor: 2700,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/scenery-package-rental-fee-weekly-lookup",
  title: "Scenery Package Rental Fee Weekly Lookup",
  description:
    "Reconcile actual scenery rental days under caller whole-week/minimum billing and separate refundable deposit; not universal rental price, prorating, rights or damage liability.",
  inputs: inputFields,
  outputs: [
    {
      id: "billableWholeRentalWeeks",
      label: "Billable whole rental weeks",
      kind: "number",
    },
    {
      id: "nonrefundableRentalAndDeliveryMinor",
      label: "Nonrefundable rental and delivery minor",
      kind: "number",
    },
    {
      id: "totalUpfrontRentalCashMinor",
      label: "Total upfront rental cash minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      actualRentalDays: value.actualRentalDays as number,
      callerMinimumChargeWeeks: value.callerMinimumChargeWeeks as number,
      callerWeeklyRentalMinor: value.callerWeeklyRentalMinor as number,
      deliveryAndCollectionMinor: value.deliveryAndCollectionMinor as number,
      refundableDepositMinor: value.refundableDepositMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
