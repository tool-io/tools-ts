import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly accountRevenue: number;
  readonly totalRevenue: number;
};
export type Output = {
  readonly share: number;
  readonly hhiContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accountRevenue: { type: "number", minimum: 0 },
    totalRevenue: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["accountRevenue", "totalRevenue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    share: { type: "number" },
    hhiContribution: { type: "number" },
  },
  required: ["share", "hhiContribution"],
} as const;
/** One account revenue share and its unscaled squared-share contribution to HHI; a full concentration index requires all accounts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accountRevenue, totalRevenue } = request;
  const compute = (): Output => {
    H.positive(totalRevenue);
    H.domain(accountRevenue >= 0 && accountRevenue <= totalRevenue);
    return {
      share: accountRevenue / totalRevenue,
      hhiContribution: (accountRevenue / totalRevenue) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { accountRevenue: 200, totalRevenue: 1000 },
  output: { share: 0.2, hhiContribution: 0.04000000000000001 },
} satisfies ToolExample<Input, Output>;
export const customerConcentrationOneAccountShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "business-analytics/customer-concentration-one-account-share",
      title: "Customer Concentration One Account Share Tool",
      description:
        "One account revenue share and its unscaled squared-share contribution to HHI; a full concentration index requires all accounts.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          accountRevenue: { type: "number", minimum: 0 },
          totalRevenue: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["accountRevenue", "totalRevenue"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          share: { type: "number" },
          hhiContribution: { type: "number" },
        },
        required: ["share", "hhiContribution"],
      },
      ports: {
        inputs: [
          {
            id: "accountRevenue",
            label: "Account Revenue",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalRevenue",
            label: "Total Revenue",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "share", label: "Share", valueType: { type: "number" } },
          {
            id: "hhiContribution",
            label: "Hhi Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = customerConcentrationOneAccountShareTool.execute;
export default customerConcentrationOneAccountShareTool;
