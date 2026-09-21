import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annualAmount: number;
  readonly eligibleDays: number;
  readonly referenceDays: number;
};
export type Output = { readonly proration: number; readonly payable: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualAmount: { type: "number", minimum: 0 },
    eligibleDays: { type: "integer", minimum: 0 },
    referenceDays: { type: "integer", minimum: 1 },
  },
  required: ["annualAmount", "eligibleDays", "referenceDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { proration: { type: "number" }, payable: { type: "number" } },
  required: ["proration", "payable"],
} as const;
/** Prorate against a caller-selected day-count basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annualAmount, eligibleDays, referenceDays } = request;
  const compute = (): Output => {
    H.domain(annualAmount >= 0);
    H.integer(referenceDays, 1);
    H.integer(eligibleDays, 0, referenceDays);
    return {
      proration: eligibleDays / referenceDays,
      payable: (annualAmount * eligibleDays) / referenceDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { annualAmount: 1200, eligibleDays: 90, referenceDays: 360 },
  output: { proration: 0.25, payable: 300 },
} satisfies ToolExample<Input, Output>;
export const agriEnvironmentContractYearProrationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-policy/agri-environment-contract-year-proration",
      title: "Agri Environment Contract Year Proration Tool",
      description: "Prorate against a caller-selected day-count basis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          annualAmount: { type: "number", minimum: 0 },
          eligibleDays: { type: "integer", minimum: 0 },
          referenceDays: { type: "integer", minimum: 1 },
        },
        required: ["annualAmount", "eligibleDays", "referenceDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          proration: { type: "number" },
          payable: { type: "number" },
        },
        required: ["proration", "payable"],
      },
      ports: {
        inputs: [
          {
            id: "annualAmount",
            label: "Annual Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eligibleDays",
            label: "Eligible Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "referenceDays",
            label: "Reference Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "proration",
            label: "Proration",
            valueType: { type: "number" },
          },
          { id: "payable", label: "Payable", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = agriEnvironmentContractYearProrationTool.execute;
export default agriEnvironmentContractYearProrationTool;
