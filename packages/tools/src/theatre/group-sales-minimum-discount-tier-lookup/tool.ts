import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  bounded,
  aligned,
  weightedMinor,
  strictlyIncreasing,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly requestedGroupSeatCount: number;
  readonly callerMinimumGroupSizes: readonly number[];
  readonly callerDiscountBasisPoints: readonly number[];
  readonly baseSeatPriceMinor: number;
}>;
export type Output = Readonly<{
  readonly groupTierEligible: boolean;
  readonly selectedGroupDiscountBasisPoints: number;
  readonly roundedGroupSeatPriceMinor: number;
  readonly totalGroupTicketPriceMinor: number;
}>;
const inputFields = [
  {
    id: "requestedGroupSeatCount",
    label: "Requested group seat count",
    kind: "number",
  },
  {
    id: "callerMinimumGroupSizes",
    label: "Caller minimum group sizes",
    kind: "numberList",
  },
  {
    id: "callerDiscountBasisPoints",
    label: "Caller discount basis points",
    kind: "numberList",
  },
  { id: "baseSeatPriceMinor", label: "Base seat price minor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.requestedGroupSeatCount, "groupSize", 1, 1000000);
  strictlyIncreasing(input.callerMinimumGroupSizes, "sizes", 1);
  input.callerMinimumGroupSizes.forEach((v) =>
    bounded(v, "minimum", 1, 1000000),
  );
  aligned(
    input.callerMinimumGroupSizes,
    input.callerDiscountBasisPoints,
    "tiers",
  );
  input.callerDiscountBasisPoints.forEach((v) =>
    bounded(v, "discount", 0, 10000),
  );
  bounded(input.baseSeatPriceMinor, "price", 0, 1000000000);
  const index = input.callerMinimumGroupSizes.reduce(
      (best, v, i) => (input.requestedGroupSeatCount >= v ? i : best),
      -1,
    ),
    discount = index < 0 ? 0 : input.callerDiscountBasisPoints[index],
    price = weightedMinor(input.baseSeatPriceMinor, 10000 - discount, 10000);
  return {
    groupTierEligible: index >= 0,
    selectedGroupDiscountBasisPoints: discount,
    roundedGroupSeatPriceMinor: price,
    totalGroupTicketPriceMinor: integer(
      price * input.requestedGroupSeatCount,
      "totalPrice",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requestedGroupSeatCount: 10,
  callerMinimumGroupSizes: [5, 10, 20],
  callerDiscountBasisPoints: [500, 1000, 2000],
  baseSeatPriceMinor: 1000,
} satisfies Input;
export const exampleOutput = {
  groupTierEligible: true,
  selectedGroupDiscountBasisPoints: 1000,
  roundedGroupSeatPriceMinor: 900,
  totalGroupTicketPriceMinor: 9000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/group-sales-minimum-discount-tier-lookup",
  title: "Group Sales Minimum Discount Tier Lookup",
  description:
    "Apply actual caller group ticket minimum/discount tier schedule, rounding per seat in one currency; below minimum remains ineligible/base price, no universal theatre policy or future sales guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "groupTierEligible", label: "Group tier eligible", kind: "boolean" },
    {
      id: "selectedGroupDiscountBasisPoints",
      label: "Selected group discount basis points",
      kind: "number",
    },
    {
      id: "roundedGroupSeatPriceMinor",
      label: "Rounded group seat price minor",
      kind: "number",
    },
    {
      id: "totalGroupTicketPriceMinor",
      label: "Total group ticket price minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      requestedGroupSeatCount: value.requestedGroupSeatCount as number,
      callerMinimumGroupSizes:
        value.callerMinimumGroupSizes as readonly number[],
      callerDiscountBasisPoints:
        value.callerDiscountBasisPoints as readonly number[],
      baseSeatPriceMinor: value.baseSeatPriceMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
