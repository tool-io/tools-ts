import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nationalSaving: number;
  readonly domesticInvestment: number;
  readonly reportedCurrentAccount: number;
};
export type Output = {
  readonly impliedCurrentAccount: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nationalSaving: { type: "number" },
    domesticInvestment: { type: "number" },
    reportedCurrentAccount: { type: "number" },
  },
  required: ["nationalSaving", "domesticInvestment", "reportedCurrentAccount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impliedCurrentAccount: { type: "number" },
    residual: { type: "number" },
  },
  required: ["impliedCurrentAccount", "residual"],
} as const;
/** Compare supplied current-account and saving-minus-investment totals on compatible accounting bases without balancing revisions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nationalSaving, domesticInvestment, reportedCurrentAccount } =
    request;
  const compute = (): Output => {
    return {
      impliedCurrentAccount: nationalSaving - domesticInvestment,
      residual: reportedCurrentAccount - (nationalSaving - domesticInvestment),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nationalSaving: 120,
    domesticInvestment: 100,
    reportedCurrentAccount: 18,
  },
  output: { impliedCurrentAccount: 20, residual: -2 },
} satisfies ToolExample<Input, Output>;
export const currentAccountSavingsInvestmentResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "international-economics",
          "international economics",
          "economics",
        ],
        keywords: ["international economics", "economics"],
      },
      id: "international-economics/current-account-savings-investment-residual",
      title: "Current Account Savings Investment Residual",
      description:
        "Compare supplied current-account and saving-minus-investment totals on compatible accounting bases without balancing revisions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nationalSaving: { type: "number" },
          domesticInvestment: { type: "number" },
          reportedCurrentAccount: { type: "number" },
        },
        required: [
          "nationalSaving",
          "domesticInvestment",
          "reportedCurrentAccount",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          impliedCurrentAccount: { type: "number" },
          residual: { type: "number" },
        },
        required: ["impliedCurrentAccount", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "nationalSaving",
            label: "National Saving",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "domesticInvestment",
            label: "Domestic Investment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reportedCurrentAccount",
            label: "Reported Current Account",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "impliedCurrentAccount",
            label: "Implied Current Account",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = currentAccountSavingsInvestmentResidualTool.execute;
export default currentAccountSavingsInvestmentResidualTool;
