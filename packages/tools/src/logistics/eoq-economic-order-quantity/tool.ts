import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EoqEconomicOrderQuantityInput = {
  readonly annualDemandUnits: number;
  readonly holdingCostPerUnitYearUsd: number;
  readonly orderCostPerOrderUsd: number;
};

export type EoqEconomicOrderQuantityOutput = {
  readonly economicOrderQuantityUnits: number;
  readonly ordersPerYear: number;
};

export const calculateEoqEconomicOrderQuantity = (
  input: EoqEconomicOrderQuantityInput,
): EoqEconomicOrderQuantityOutput => {
  if (!Number.isFinite(input.annualDemandUnits) || input.annualDemandUnits <= 0)
    return simpleError(
      "annualDemandUnits",
      "Annual demand must be finite and greater than zero.",
      "invalid_demand",
    );
  if (
    !Number.isFinite(input.holdingCostPerUnitYearUsd) ||
    input.holdingCostPerUnitYearUsd <= 0
  )
    return simpleError(
      "holdingCostPerUnitYearUsd",
      "Holding cost must be greater than zero.",
      "invalid_cost",
    );
  if (
    !Number.isFinite(input.orderCostPerOrderUsd) ||
    input.orderCostPerOrderUsd <= 0
  )
    return simpleError(
      "orderCostPerOrderUsd",
      "Order cost must be greater than zero.",
      "invalid_cost",
    );
  let economicOrderQuantityUnits = Math.sqrt(
    (2 * input.annualDemandUnits * input.orderCostPerOrderUsd) /
      input.holdingCostPerUnitYearUsd,
  );
  if (
    !Number.isFinite(economicOrderQuantityUnits) ||
    economicOrderQuantityUnits <= 0
  )
    economicOrderQuantityUnits = Math.exp(
      0.5 *
        (Math.log(2) +
          Math.log(input.annualDemandUnits) +
          Math.log(input.orderCostPerOrderUsd) -
          Math.log(input.holdingCostPerUnitYearUsd)),
    );
  const ordersPerYear = input.annualDemandUnits / economicOrderQuantityUnits;
  if (
    !Number.isFinite(economicOrderQuantityUnits) ||
    economicOrderQuantityUnits <= 0 ||
    !Number.isFinite(ordersPerYear) ||
    ordersPerYear <= 0
  )
    return simpleError(
      "annualDemandUnits",
      "The EOQ result is outside the representable range.",
      "result_out_of_range",
    );
  return {
    economicOrderQuantityUnits,
    ordersPerYear,
  };
};

export const eoqEconomicOrderQuantityExample = {
  input: {
    annualDemandUnits: 12000,
    holdingCostPerUnitYearUsd: 3,
    orderCostPerOrderUsd: 75,
  },
  output: {
    economicOrderQuantityUnits: 774.5966692414834,
    ordersPerYear: 15.491933384829668,
  },
} satisfies ToolExample<
  EoqEconomicOrderQuantityInput,
  EoqEconomicOrderQuantityOutput
>;

export const eoqEconomicOrderQuantityTool = createSimpleTool({
  id: "logistics/eoq-economic-order-quantity",
  title: "EOQ Economic Order Quantity Calculator",
  description:
    "Solve the classical Wilson EOQ square root of two DS over H and the implied number of orders per year.",
  inputs: [
    {
      description: "Annual demand in units (D).",
      id: "annualDemandUnits",
      kind: "number",
      label: "Annual demand",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Fixed cost per order placed in USD (S).",
      id: "orderCostPerOrderUsd",
      kind: "number",
      label: "Order cost",
      minimum: Number.MIN_VALUE,
      unit: "USD/order",
    },
    {
      description: "Annual holding cost per unit in USD (H).",
      id: "holdingCostPerUnitYearUsd",
      kind: "number",
      label: "Holding cost/unit/yr",
      minimum: Number.MIN_VALUE,
      unit: "USD/unit/year",
    },
  ],
  outputs: [
    {
      description: "Economic order quantity in units.",
      id: "economicOrderQuantityUnits",
      kind: "number",
      label: "EOQ",
    },
    {
      description: "Orders placed per year at the EOQ.",
      id: "ordersPerYear",
      kind: "number",
      label: "Orders/year",
    },
  ],
  calculate: (input) =>
    calculateEoqEconomicOrderQuantity({
      annualDemandUnits: input.annualDemandUnits as number,
      holdingCostPerUnitYearUsd: input.holdingCostPerUnitYearUsd as number,
      orderCostPerOrderUsd: input.orderCostPerOrderUsd as number,
    }),
});

export const runEoqEconomicOrderQuantity = eoqEconomicOrderQuantityTool.execute;
export default eoqEconomicOrderQuantityTool;
