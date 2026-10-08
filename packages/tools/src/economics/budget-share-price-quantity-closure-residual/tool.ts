import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly price: number;
  readonly quantity: number;
  readonly suppliedBudget: number;
  readonly suppliedShare: number;
};
export type Output = {
  readonly observedExpenditure: number;
  readonly impliedExpenditure: number;
  readonly closureResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number", minimum: 0 },
    quantity: { type: "number", minimum: 0 },
    suppliedBudget: { type: "number", minimum: 0 },
    suppliedShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["price", "quantity", "suppliedBudget", "suppliedShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedExpenditure: { type: "number" },
    impliedExpenditure: { type: "number" },
    closureResidual: { type: "number" },
  },
  required: ["observedExpenditure", "impliedExpenditure", "closureResidual"],
} as const;
/** Compare explicit price-times-quantity expenditure with a supplied budget-share amount on a common currency basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { price, quantity, suppliedBudget, suppliedShare } = request;
  const compute = (): Output => {
    H.domain(price >= 0 && quantity >= 0 && suppliedBudget >= 0, "price");
    (H.domain(suppliedShare >= 0 && suppliedShare <= 1, "suppliedShare"),
      suppliedShare);
    return {
      observedExpenditure: price * quantity,
      impliedExpenditure: suppliedBudget * suppliedShare,
      closureResidual: price * quantity - suppliedBudget * suppliedShare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { price: 3, quantity: 10, suppliedBudget: 100, suppliedShare: 0.25 },
  output: {
    observedExpenditure: 30,
    impliedExpenditure: 25,
    closureResidual: 5,
  },
} satisfies ToolExample<Input, Output>;
export const budgetSharePriceQuantityClosureResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["economics"],
        keywords: ["economics"],
      },
      id: "economics/budget-share-price-quantity-closure-residual",
      title: "Budget Share Price Quantity Closure Residual",
      description:
        "Compare explicit price-times-quantity expenditure with a supplied budget-share amount on a common currency basis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          price: { type: "number", minimum: 0 },
          quantity: { type: "number", minimum: 0 },
          suppliedBudget: { type: "number", minimum: 0 },
          suppliedShare: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["price", "quantity", "suppliedBudget", "suppliedShare"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedExpenditure: { type: "number" },
          impliedExpenditure: { type: "number" },
          closureResidual: { type: "number" },
        },
        required: [
          "observedExpenditure",
          "impliedExpenditure",
          "closureResidual",
        ],
      },
      ports: {
        inputs: [
          {
            id: "price",
            label: "Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "quantity",
            label: "Quantity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedBudget",
            label: "Supplied Budget",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedShare",
            label: "Supplied Share",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "observedExpenditure",
            label: "Observed Expenditure",
            valueType: { type: "number" },
          },
          {
            id: "impliedExpenditure",
            label: "Implied Expenditure",
            valueType: { type: "number" },
          },
          {
            id: "closureResidual",
            label: "Closure Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = budgetSharePriceQuantityClosureResidualTool.execute;
export default budgetSharePriceQuantityClosureResidualTool;
