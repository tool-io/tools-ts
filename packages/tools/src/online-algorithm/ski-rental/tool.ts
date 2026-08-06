import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SkiRentalResult = {
  readonly competitiveRatio: number;
  readonly decision: string;
  readonly onlineCost: number;
  readonly optimalCost: number;
  readonly purchaseDay: number;
};

export const demonstrateSkiRental = (
  rentalCost: number,
  purchaseCost: number,
  usageDays: number,
): SkiRentalResult => {
  const purchaseDay = Math.ceil(purchaseCost / rentalCost);
  const onlineCost =
    usageDays < purchaseDay
      ? usageDays * rentalCost
      : (purchaseDay - 1) * rentalCost + purchaseCost;
  const optimalCost = Math.min(usageDays * rentalCost, purchaseCost);
  return {
    competitiveRatio:
      optimalCost === 0
        ? 1
        : Number((onlineCost / optimalCost).toPrecision(12)),
    decision: usageDays < purchaseDay ? "rent" : `buy on day ${purchaseDay}`,
    onlineCost,
    optimalCost,
    purchaseDay,
  };
};

export const skiRentalExample = {
  input: { purchaseCost: 100, rentalCost: 10, usageDays: 15 },
  output: {
    result: {
      competitiveRatio: 1.9,
      decision: "buy on day 10",
      onlineCost: 190,
      optimalCost: 100,
      purchaseDay: 10,
    },
  },
} satisfies ToolExample<
  {
    readonly purchaseCost: number;
    readonly rentalCost: number;
    readonly usageDays: number;
  },
  { readonly result: SkiRentalResult }
>;

export const skiRentalTool = createSimpleTool({
  id: "online-algorithm/ski-rental",
  title: "Online Ski-Rental Algorithm Demonstrator",
  description:
    "Compare a deterministic rent-or-buy strategy with the optimal decision made in hindsight.",
  inputs: [
    {
      id: "rentalCost",
      kind: "number",
      label: "Rental cost per day",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "purchaseCost",
      kind: "number",
      label: "Purchase cost",
      minimum: Number.MIN_VALUE,
    },
    { id: "usageDays", kind: "integer", label: "Usage days", minimum: 0 },
  ],
  outputs: [
    {
      format: "online-algorithm/ski-rental",
      id: "result",
      kind: "object",
      label: "Online decision",
    },
  ],
  calculate: (input) => ({
    result: demonstrateSkiRental(
      input.rentalCost as number,
      input.purchaseCost as number,
      input.usageDays as number,
    ),
  }),
});

export const runSkiRental = skiRentalTool.execute;
export default skiRentalTool;
