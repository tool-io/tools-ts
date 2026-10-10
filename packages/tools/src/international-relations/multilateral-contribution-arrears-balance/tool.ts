import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingArrears: number;
  readonly assessedContribution: number;
  readonly recordedPayment: number;
};
export type Output = { readonly closingArrears: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingArrears: { type: "number", minimum: 0 },
    assessedContribution: { type: "number", minimum: 0 },
    recordedPayment: { type: "number", minimum: 0 },
  },
  required: ["openingArrears", "assessedContribution", "recordedPayment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingArrears: { type: "number" } },
  required: ["closingArrears"],
} as const;
/** Reconcile explicit multilateral contribution amounts in one currency, preserving an excess payment as a negative balance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingArrears, assessedContribution, recordedPayment } = request;
  const compute = (): Output => {
    H.domain(
      openingArrears >= 0 && assessedContribution >= 0 && recordedPayment >= 0,
      "openingArrears",
    );
    return {
      closingArrears: openingArrears + assessedContribution - recordedPayment,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingArrears: 100, assessedContribution: 40, recordedPayment: 60 },
  output: { closingArrears: 80 },
} satisfies ToolExample<Input, Output>;
export const multilateralContributionArrearsBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "international-relations",
          "international relations",
          "social sciences",
        ],
        keywords: ["international relations", "social sciences"],
      },
      id: "international-relations/multilateral-contribution-arrears-balance",
      title: "Multilateral Contribution Arrears Balance",
      description:
        "Reconcile explicit multilateral contribution amounts in one currency, preserving an excess payment as a negative balance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingArrears: { type: "number", minimum: 0 },
          assessedContribution: { type: "number", minimum: 0 },
          recordedPayment: { type: "number", minimum: 0 },
        },
        required: ["openingArrears", "assessedContribution", "recordedPayment"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { closingArrears: { type: "number" } },
        required: ["closingArrears"],
      },
      ports: {
        inputs: [
          {
            id: "openingArrears",
            label: "Opening Arrears",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "assessedContribution",
            label: "Assessed Contribution",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recordedPayment",
            label: "Recorded Payment",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "closingArrears",
            label: "Closing Arrears",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = multilateralContributionArrearsBalanceTool.execute;
export default multilateralContributionArrearsBalanceTool;
