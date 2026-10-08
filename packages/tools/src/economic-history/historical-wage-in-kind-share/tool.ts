import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashWageValue: number;
  readonly inKindAssignedValue: number;
};
export type Output = {
  readonly totalAssignedWage: number;
  readonly inKindShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashWageValue: { type: "number", minimum: 0 },
    inKindAssignedValue: { type: "number", minimum: 0 },
  },
  required: ["cashWageValue", "inKindAssignedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalAssignedWage: { type: "number" },
    inKindShare: { type: "number" },
  },
  required: ["totalAssignedWage", "inKindShare"],
} as const;
/** Combine explicit cash wages and assigned in-kind values in one historical valuation basis without estimating a conversion rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashWageValue, inKindAssignedValue } = request;
  const compute = (): Output => {
    H.domain(
      cashWageValue >= 0 &&
        inKindAssignedValue >= 0 &&
        cashWageValue + inKindAssignedValue > 0,
      "cashWageValue",
    );
    return {
      totalAssignedWage: cashWageValue + inKindAssignedValue,
      inKindShare: inKindAssignedValue / (cashWageValue + inKindAssignedValue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cashWageValue: 8, inKindAssignedValue: 2 },
  output: { totalAssignedWage: 10, inKindShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const historicalWageInKindShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["economic-history", "economic history", "economics"],
      keywords: ["economic history", "economics"],
    },
    id: "economic-history/historical-wage-in-kind-share",
    title: "Historical Wage In Kind Share",
    description:
      "Combine explicit cash wages and assigned in-kind values in one historical valuation basis without estimating a conversion rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashWageValue: { type: "number", minimum: 0 },
        inKindAssignedValue: { type: "number", minimum: 0 },
      },
      required: ["cashWageValue", "inKindAssignedValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalAssignedWage: { type: "number" },
        inKindShare: { type: "number" },
      },
      required: ["totalAssignedWage", "inKindShare"],
    },
    ports: {
      inputs: [
        {
          id: "cashWageValue",
          label: "Cash Wage Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inKindAssignedValue",
          label: "In Kind Assigned Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalAssignedWage",
          label: "Total Assigned Wage",
          valueType: { type: "number" },
        },
        {
          id: "inKindShare",
          label: "In Kind Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalWageInKindShareTool.execute;
export default historicalWageInKindShareTool;
