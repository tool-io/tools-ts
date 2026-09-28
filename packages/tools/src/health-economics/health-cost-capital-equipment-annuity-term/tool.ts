import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purchaseCost: number;
  readonly residualValue: number;
  readonly lifetimeYears: number;
  readonly discountRate: number;
  readonly annualUses: number;
};
export type Output = {
  readonly equivalentAnnualCost: number;
  readonly capitalCostPerUse: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchaseCost: { type: "number", minimum: 0 },
    residualValue: { type: "number", minimum: 0 },
    lifetimeYears: { type: "integer", minimum: 1 },
    discountRate: { type: "number", exclusiveMinimum: -1 },
    annualUses: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "purchaseCost",
    "residualValue",
    "lifetimeYears",
    "discountRate",
    "annualUses",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentAnnualCost: { type: "number" },
    capitalCostPerUse: { type: "number" },
  },
  required: ["equivalentAnnualCost", "capitalCostPerUse"],
} as const;
/** Level end-year capital-cost annuity with end-of-life residual value and explicit utilization; maintenance costs are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    purchaseCost,
    residualValue,
    lifetimeYears,
    discountRate,
    annualUses,
  } = request;
  const compute = (): Output => {
    H.domain(purchaseCost >= 0 && residualValue >= 0 && discountRate > -1);
    H.integer(lifetimeYears, 1);
    H.positive(annualUses);
    return {
      equivalentAnnualCost:
        discountRate === 0
          ? (purchaseCost - residualValue) / lifetimeYears
          : ((purchaseCost -
              residualValue / (1 + discountRate) ** lifetimeYears) *
              discountRate) /
            -Math.expm1(-lifetimeYears * Math.log1p(discountRate)),
      capitalCostPerUse:
        (discountRate === 0
          ? (purchaseCost - residualValue) / lifetimeYears
          : ((purchaseCost -
              residualValue / (1 + discountRate) ** lifetimeYears) *
              discountRate) /
            -Math.expm1(-lifetimeYears * Math.log1p(discountRate))) /
        annualUses,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    purchaseCost: 10000,
    residualValue: 2000,
    lifetimeYears: 4,
    discountRate: 0,
    annualUses: 200,
  },
  output: { equivalentAnnualCost: 2000, capitalCostPerUse: 10 },
} satisfies ToolExample<Input, Output>;
export const healthCostCapitalEquipmentAnnuityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/health-cost-capital-equipment-annuity-term",
      title: "Health Cost Capital Equipment Annuity Term Tool",
      description:
        "Level end-year capital-cost annuity with end-of-life residual value and explicit utilization; maintenance costs are excluded.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          purchaseCost: { type: "number", minimum: 0 },
          residualValue: { type: "number", minimum: 0 },
          lifetimeYears: { type: "integer", minimum: 1 },
          discountRate: { type: "number", exclusiveMinimum: -1 },
          annualUses: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "purchaseCost",
          "residualValue",
          "lifetimeYears",
          "discountRate",
          "annualUses",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equivalentAnnualCost: { type: "number" },
          capitalCostPerUse: { type: "number" },
        },
        required: ["equivalentAnnualCost", "capitalCostPerUse"],
      },
      ports: {
        inputs: [
          {
            id: "purchaseCost",
            label: "Purchase Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "residualValue",
            label: "Residual Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lifetimeYears",
            label: "Lifetime Years",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "discountRate",
            label: "Discount Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "annualUses",
            label: "Annual Uses",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "equivalentAnnualCost",
            label: "Equivalent Annual Cost",
            valueType: { type: "number" },
          },
          {
            id: "capitalCostPerUse",
            label: "Capital Cost Per Use",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthCostCapitalEquipmentAnnuityTermTool.execute;
export default healthCostCapitalEquipmentAnnuityTermTool;
