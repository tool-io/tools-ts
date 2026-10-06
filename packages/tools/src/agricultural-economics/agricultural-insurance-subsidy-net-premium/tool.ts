import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossPremium: number;
  readonly subsidyAmount: number;
};
export type Output = { readonly netPremium: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPremium: { type: "number", minimum: 0 },
    subsidyAmount: { type: "number", minimum: 0 },
  },
  required: ["grossPremium", "subsidyAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netPremium: { type: "number" } },
  required: ["netPremium"],
} as const;
/** Subtract an explicit subsidy amount from a supplied agricultural insurance premium without determining eligibility or clipping discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossPremium, subsidyAmount } = request;
  const compute = (): Output => {
    H.domain(grossPremium >= 0, "grossPremium");
    H.domain(subsidyAmount >= 0, "subsidyAmount");
    return { netPremium: grossPremium - subsidyAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossPremium: 800, subsidyAmount: 300 },
  output: { netPremium: 500 },
} satisfies ToolExample<Input, Output>;
export const agriculturalInsuranceSubsidyNetPremiumTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "agricultural-economics",
          "agricultural economics",
          "agriculture",
        ],
        keywords: ["agricultural economics", "agriculture"],
      },
      id: "agricultural-economics/agricultural-insurance-subsidy-net-premium",
      title: "Agricultural Insurance Subsidy Net Premium",
      description:
        "Subtract an explicit subsidy amount from a supplied agricultural insurance premium without determining eligibility or clipping discrepancies.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossPremium: { type: "number", minimum: 0 },
          subsidyAmount: { type: "number", minimum: 0 },
        },
        required: ["grossPremium", "subsidyAmount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { netPremium: { type: "number" } },
        required: ["netPremium"],
      },
      ports: {
        inputs: [
          {
            id: "grossPremium",
            label: "Gross Premium",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "subsidyAmount",
            label: "Subsidy Amount",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netPremium",
            label: "Net Premium",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalInsuranceSubsidyNetPremiumTool.execute;
export default agriculturalInsuranceSubsidyNetPremiumTool;
