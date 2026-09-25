import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly careHours: number;
  readonly paidReplacementRate: number;
  readonly foregoneWage: number;
  readonly foregoneFraction: number;
};
export type Output = {
  readonly replacementCost: number;
  readonly opportunityCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    careHours: { type: "number", minimum: 0 },
    paidReplacementRate: { type: "number", minimum: 0 },
    foregoneWage: { type: "number", minimum: 0 },
    foregoneFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "careHours",
    "paidReplacementRate",
    "foregoneWage",
    "foregoneFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    replacementCost: { type: "number" },
    opportunityCost: { type: "number" },
  },
  required: ["replacementCost", "opportunityCost"],
} as const;
/** Report replacement and foregone-income valuations separately to avoid automatically double-counting the same care hours. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { careHours, paidReplacementRate, foregoneWage, foregoneFraction } =
    request;
  const compute = (): Output => {
    H.domain(careHours >= 0 && paidReplacementRate >= 0 && foregoneWage >= 0);
    H.probability(foregoneFraction);
    return {
      replacementCost: careHours * paidReplacementRate,
      opportunityCost: careHours * foregoneWage * foregoneFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    careHours: 20,
    paidReplacementRate: 15,
    foregoneWage: 25,
    foregoneFraction: 0.5,
  },
  output: { replacementCost: 300, opportunityCost: 250 },
} satisfies ToolExample<Input, Output>;
export const eldercareOpportunityCostHourTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/eldercare-opportunity-cost-hour-term",
    title: "Eldercare Opportunity Cost Hour Term Tool",
    description:
      "Report replacement and foregone-income valuations separately to avoid automatically double-counting the same care hours.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        careHours: { type: "number", minimum: 0 },
        paidReplacementRate: { type: "number", minimum: 0 },
        foregoneWage: { type: "number", minimum: 0 },
        foregoneFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "careHours",
        "paidReplacementRate",
        "foregoneWage",
        "foregoneFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        replacementCost: { type: "number" },
        opportunityCost: { type: "number" },
      },
      required: ["replacementCost", "opportunityCost"],
    },
    ports: {
      inputs: [
        {
          id: "careHours",
          label: "Care Hours",
          required: true,
          valueType: { type: "number", unit: "h" },
        },
        {
          id: "paidReplacementRate",
          label: "Paid Replacement Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "foregoneWage",
          label: "Foregone Wage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "foregoneFraction",
          label: "Foregone Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "replacementCost",
          label: "Replacement Cost",
          valueType: { type: "number" },
        },
        {
          id: "opportunityCost",
          label: "Opportunity Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eldercareOpportunityCostHourTermTool.execute;
export default eldercareOpportunityCostHourTermTool;
