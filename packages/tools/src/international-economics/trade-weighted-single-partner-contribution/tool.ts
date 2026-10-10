import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly partnerWeight: number;
  readonly partnerIndicator: number;
};
export type Output = { readonly weightedContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partnerWeight: { type: "number", minimum: 0, maximum: 1 },
    partnerIndicator: { type: "number" },
  },
  required: ["partnerWeight", "partnerIndicator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedContribution: { type: "number" } },
  required: ["weightedContribution"],
} as const;
/** Multiply one supplied partner weight by a signed indicator without constructing or normalizing an international trade index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { partnerWeight, partnerIndicator } = request;
  const compute = (): Output => {
    (H.domain(partnerWeight >= 0 && partnerWeight <= 1, "partnerWeight"),
      partnerWeight);
    return { weightedContribution: partnerWeight * partnerIndicator };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { partnerWeight: 0.25, partnerIndicator: 8 },
  output: { weightedContribution: 2 },
} satisfies ToolExample<Input, Output>;
export const tradeWeightedSinglePartnerContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-economics/trade-weighted-single-partner-contribution",
      title: "Trade Weighted Single Partner Contribution Tool",
      description:
        "Multiply one supplied partner weight by a signed indicator without constructing or normalizing an international trade index.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          partnerWeight: { type: "number", minimum: 0, maximum: 1 },
          partnerIndicator: { type: "number" },
        },
        required: ["partnerWeight", "partnerIndicator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { weightedContribution: { type: "number" } },
        required: ["weightedContribution"],
      },
      ports: {
        inputs: [
          {
            id: "partnerWeight",
            label: "Partner Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "partnerIndicator",
            label: "Partner Indicator",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "weightedContribution",
            label: "Weighted Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tradeWeightedSinglePartnerContributionTool.execute;
export default tradeWeightedSinglePartnerContributionTool;
