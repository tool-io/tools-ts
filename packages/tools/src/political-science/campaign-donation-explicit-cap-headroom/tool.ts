import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorDonation: number;
  readonly proposedDonation: number;
  readonly suppliedCap: number;
};
export type Output = {
  readonly total: number;
  readonly headroom: number;
  readonly exceeds: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorDonation: { type: "number", minimum: 0 },
    proposedDonation: { type: "number", minimum: 0 },
    suppliedCap: { type: "number", minimum: 0 },
  },
  required: ["priorDonation", "proposedDonation", "suppliedCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "number" },
    headroom: { type: "number" },
    exceeds: { type: "boolean" },
  },
  required: ["total", "headroom", "exceeds"],
} as const;
/** Apply a supplied aggregate cap, without choosing campaign law or donor eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorDonation, proposedDonation, suppliedCap } = request;
  const compute = (): Output => {
    H.domain(priorDonation >= 0 && proposedDonation >= 0 && suppliedCap >= 0);
    return {
      total: priorDonation + proposedDonation,
      headroom: suppliedCap - priorDonation - proposedDonation,
      exceeds: priorDonation + proposedDonation > suppliedCap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priorDonation: 400, proposedDonation: 200, suppliedCap: 500 },
  output: { total: 600, headroom: -100, exceeds: true },
} satisfies ToolExample<Input, Output>;
export const campaignDonationExplicitCapHeadroomTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "political-science/campaign-donation-explicit-cap-headroom",
      title: "Campaign Donation Explicit Cap Headroom Tool",
      description:
        "Apply a supplied aggregate cap, without choosing campaign law or donor eligibility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          priorDonation: { type: "number", minimum: 0 },
          proposedDonation: { type: "number", minimum: 0 },
          suppliedCap: { type: "number", minimum: 0 },
        },
        required: ["priorDonation", "proposedDonation", "suppliedCap"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          total: { type: "number" },
          headroom: { type: "number" },
          exceeds: { type: "boolean" },
        },
        required: ["total", "headroom", "exceeds"],
      },
      ports: {
        inputs: [
          {
            id: "priorDonation",
            label: "Prior Donation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "proposedDonation",
            label: "Proposed Donation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedCap",
            label: "Supplied Cap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "total", label: "Total", valueType: { type: "number" } },
          { id: "headroom", label: "Headroom", valueType: { type: "number" } },
          { id: "exceeds", label: "Exceeds", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = campaignDonationExplicitCapHeadroomTool.execute;
export default campaignDonationExplicitCapHeadroomTool;
