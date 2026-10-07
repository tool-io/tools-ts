import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly donorAmount: number;
  readonly suppliedMatchPerUnit: number;
  readonly matchCap: number;
};
export type Output = {
  readonly matchAmount: number;
  readonly totalDonation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    donorAmount: { type: "number", minimum: 0 },
    suppliedMatchPerUnit: { type: "number", minimum: 0 },
    matchCap: { type: "number", minimum: 0 },
  },
  required: ["donorAmount", "suppliedMatchPerUnit", "matchCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchAmount: { type: "number" },
    totalDonation: { type: "number" },
  },
  required: ["matchAmount", "totalDonation"],
} as const;
/** Apply a supplied per-unit matching-gift rate and cap to one donor amount without selecting campaign terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { donorAmount, suppliedMatchPerUnit, matchCap } = request;
  const compute = (): Output => {
    H.domain(donorAmount >= 0, "donorAmount");
    H.domain(suppliedMatchPerUnit >= 0, "suppliedMatchPerUnit");
    H.domain(matchCap >= 0, "matchCap");
    return {
      matchAmount: Math.min(donorAmount * suppliedMatchPerUnit, matchCap),
      totalDonation:
        donorAmount + Math.min(donorAmount * suppliedMatchPerUnit, matchCap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { donorAmount: 100, suppliedMatchPerUnit: 2, matchCap: 150 },
  output: { matchAmount: 150, totalDonation: 250 },
} satisfies ToolExample<Input, Output>;
export const matchingGiftNetDonationAmountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/matching-gift-net-donation-amount",
    title: "Matching Gift Net Donation Amount",
    description:
      "Apply a supplied per-unit matching-gift rate and cap to one donor amount without selecting campaign terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        donorAmount: { type: "number", minimum: 0 },
        suppliedMatchPerUnit: { type: "number", minimum: 0 },
        matchCap: { type: "number", minimum: 0 },
      },
      required: ["donorAmount", "suppliedMatchPerUnit", "matchCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchAmount: { type: "number" },
        totalDonation: { type: "number" },
      },
      required: ["matchAmount", "totalDonation"],
    },
    ports: {
      inputs: [
        {
          id: "donorAmount",
          label: "Donor Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMatchPerUnit",
          label: "Supplied Match Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "matchCap",
          label: "Match Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "matchAmount",
          label: "Match Amount",
          valueType: { type: "number" },
        },
        {
          id: "totalDonation",
          label: "Total Donation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = matchingGiftNetDonationAmountTool.execute;
export default matchingGiftNetDonationAmountTool;
