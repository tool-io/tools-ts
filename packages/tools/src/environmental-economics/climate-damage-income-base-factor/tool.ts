import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineIncome: number;
  readonly incomeMultiplier: number;
  readonly damageFraction: number;
  readonly incomeElasticity: number;
};
export type Output = {
  readonly adjustedIncome: number;
  readonly damage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineIncome: { type: "number", minimum: 0 },
    incomeMultiplier: { type: "number", exclusiveMinimum: 0 },
    damageFraction: { type: "number", minimum: 0, maximum: 1 },
    incomeElasticity: { type: "number" },
  },
  required: [
    "baselineIncome",
    "incomeMultiplier",
    "damageFraction",
    "incomeElasticity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedIncome: { type: "number" },
    damage: { type: "number" },
  },
  required: ["adjustedIncome", "damage"],
} as const;
/** Caller-defined income-elastic damage scaling, without estimating a climate damage function. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineIncome, incomeMultiplier, damageFraction, incomeElasticity } =
    request;
  const compute = (): Output => {
    H.domain(baselineIncome >= 0);
    H.positive(incomeMultiplier);
    H.probability(damageFraction);
    return {
      adjustedIncome: baselineIncome * incomeMultiplier,
      damage:
        baselineIncome * damageFraction * incomeMultiplier ** incomeElasticity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baselineIncome: 1000000,
    incomeMultiplier: 2,
    damageFraction: 0.01,
    incomeElasticity: 1,
  },
  output: { adjustedIncome: 2000000, damage: 20000 },
} satisfies ToolExample<Input, Output>;
export const climateDamageIncomeBaseFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/climate-damage-income-base-factor",
    title: "Climate Damage Income Base Factor Tool",
    description:
      "Caller-defined income-elastic damage scaling, without estimating a climate damage function.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineIncome: { type: "number", minimum: 0 },
        incomeMultiplier: { type: "number", exclusiveMinimum: 0 },
        damageFraction: { type: "number", minimum: 0, maximum: 1 },
        incomeElasticity: { type: "number" },
      },
      required: [
        "baselineIncome",
        "incomeMultiplier",
        "damageFraction",
        "incomeElasticity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedIncome: { type: "number" },
        damage: { type: "number" },
      },
      required: ["adjustedIncome", "damage"],
    },
    ports: {
      inputs: [
        {
          id: "baselineIncome",
          label: "Baseline Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incomeMultiplier",
          label: "Income Multiplier",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "damageFraction",
          label: "Damage Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incomeElasticity",
          label: "Income Elasticity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjustedIncome",
          label: "Adjusted Income",
          valueType: { type: "number" },
        },
        { id: "damage", label: "Damage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = climateDamageIncomeBaseFactorTool.execute;
export default climateDamageIncomeBaseFactorTool;
