import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly donationId: string;
  readonly suppliedDateText: string;
  readonly dateMeaning: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    donationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDateText: { type: "string", maxLength: 8192, minLength: 1 },
    dateMeaning: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["donationId", "suppliedDateText", "dateMeaning"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit community-fridge donation date wording without inferring food shelf life or safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { donationId, suppliedDateText, dateMeaning } = request;
  const compute = (): Output => {
    H.domain(donationId.length > 0, "donationId");
    H.domain(suppliedDateText.length > 0, "suppliedDateText");
    H.domain(dateMeaning.length > 0, "dateMeaning");
    return {
      token: JSON.stringify([donationId, suppliedDateText, dateMeaning]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    donationId: "D17",
    suppliedDateText: "2026-11-01",
    dateMeaning: "donated on",
  },
  output: { token: '["D17","2026-11-01","donated on"]' },
} satisfies ToolExample<Input, Output>;
export const communityFridgeDonationDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/community-fridge-donation-date-label",
    title: "Community Fridge Donation Date Label",
    description:
      "Preserve explicit community-fridge donation date wording without inferring food shelf life or safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        donationId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedDateText: { type: "string", maxLength: 8192, minLength: 1 },
        dateMeaning: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["donationId", "suppliedDateText", "dateMeaning"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "donationId",
          label: "Donation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedDateText",
          label: "Supplied Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateMeaning",
          label: "Date Meaning",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = communityFridgeDonationDateLabelTool.execute;
export default communityFridgeDonationDateLabelTool;
