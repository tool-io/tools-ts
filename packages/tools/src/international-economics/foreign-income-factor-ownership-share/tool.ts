import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalFactorIncome: number;
  readonly suppliedForeignOwnershipFraction: number;
};
export type Output = {
  readonly foreignAllocatedIncome: number;
  readonly domesticAllocatedIncome: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFactorIncome: { type: "number" },
    suppliedForeignOwnershipFraction: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["totalFactorIncome", "suppliedForeignOwnershipFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foreignAllocatedIncome: { type: "number" },
    domesticAllocatedIncome: { type: "number" },
  },
  required: ["foreignAllocatedIncome", "domesticAllocatedIncome"],
} as const;
/** Allocate supplied signed factor income by an explicit foreign ownership fraction without determining residency or tax treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalFactorIncome, suppliedForeignOwnershipFraction } = request;
  const compute = (): Output => {
    (H.domain(
      suppliedForeignOwnershipFraction >= 0 &&
        suppliedForeignOwnershipFraction <= 1,
      "suppliedForeignOwnershipFraction",
    ),
      suppliedForeignOwnershipFraction);
    return {
      foreignAllocatedIncome:
        totalFactorIncome * suppliedForeignOwnershipFraction,
      domesticAllocatedIncome:
        totalFactorIncome * (1 - suppliedForeignOwnershipFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalFactorIncome: 400, suppliedForeignOwnershipFraction: 0.25 },
  output: { foreignAllocatedIncome: 100, domesticAllocatedIncome: 300 },
} satisfies ToolExample<Input, Output>;
export const foreignIncomeFactorOwnershipShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/foreign-income-factor-ownership-share",
    title: "Foreign Income Factor Ownership Share Tool",
    description:
      "Allocate supplied signed factor income by an explicit foreign ownership fraction without determining residency or tax treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFactorIncome: { type: "number" },
        suppliedForeignOwnershipFraction: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
      },
      required: ["totalFactorIncome", "suppliedForeignOwnershipFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        foreignAllocatedIncome: { type: "number" },
        domesticAllocatedIncome: { type: "number" },
      },
      required: ["foreignAllocatedIncome", "domesticAllocatedIncome"],
    },
    ports: {
      inputs: [
        {
          id: "totalFactorIncome",
          label: "Total Factor Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedForeignOwnershipFraction",
          label: "Supplied Foreign Ownership Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "foreignAllocatedIncome",
          label: "Foreign Allocated Income",
          valueType: { type: "number" },
        },
        {
          id: "domesticAllocatedIncome",
          label: "Domestic Allocated Income",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foreignIncomeFactorOwnershipShareTool.execute;
export default foreignIncomeFactorOwnershipShareTool;
