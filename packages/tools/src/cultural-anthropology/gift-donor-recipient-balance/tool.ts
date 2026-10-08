import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly donorRecordedValue: number;
  readonly recipientRecordedValue: number;
};
export type Output = { readonly recordedValueGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    donorRecordedValue: { type: "number", minimum: 0 },
    recipientRecordedValue: { type: "number", minimum: 0 },
  },
  required: ["donorRecordedValue", "recipientRecordedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recordedValueGap: { type: "number" } },
  required: ["recordedValueGap"],
} as const;
/** Compare two explicitly recorded valuations of the same gift in a common analytical unit without assigning social equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { donorRecordedValue, recipientRecordedValue } = request;
  const compute = (): Output => {
    H.domain(
      donorRecordedValue >= 0 && recipientRecordedValue >= 0,
      "donorRecordedValue",
    );
    return { recordedValueGap: recipientRecordedValue - donorRecordedValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { donorRecordedValue: 20, recipientRecordedValue: 25 },
  output: { recordedValueGap: 5 },
} satisfies ToolExample<Input, Output>;
export const giftDonorrecipientBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "cultural-anthropology",
        "cultural anthropology",
        "social sciences",
      ],
      keywords: ["cultural anthropology", "social sciences"],
    },
    id: "cultural-anthropology/gift-donor-recipient-balance",
    title: "Gift Donor Recipient Balance",
    description:
      "Compare two explicitly recorded valuations of the same gift in a common analytical unit without assigning social equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        donorRecordedValue: { type: "number", minimum: 0 },
        recipientRecordedValue: { type: "number", minimum: 0 },
      },
      required: ["donorRecordedValue", "recipientRecordedValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recordedValueGap: { type: "number" } },
      required: ["recordedValueGap"],
    },
    ports: {
      inputs: [
        {
          id: "donorRecordedValue",
          label: "Donor Recorded Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recipientRecordedValue",
          label: "Recipient Recorded Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recordedValueGap",
          label: "Recorded Value Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = giftDonorrecipientBalanceTool.execute;
export default giftDonorrecipientBalanceTool;
