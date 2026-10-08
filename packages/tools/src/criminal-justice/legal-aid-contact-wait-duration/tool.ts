import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestTimestampSeconds: number;
  readonly contactTimestampSeconds: number;
};
export type Output = { readonly waitSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestTimestampSeconds: { type: "number" },
    contactTimestampSeconds: { type: "number" },
  },
  required: ["requestTimestampSeconds", "contactTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { waitSeconds: { type: "number" } },
  required: ["waitSeconds"],
} as const;
/** Measure an ordered recorded legal-aid request-to-contact interval without determining legal service deadlines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestTimestampSeconds, contactTimestampSeconds } = request;
  const compute = (): Output => {
    H.domain(
      contactTimestampSeconds >= requestTimestampSeconds,
      "contactTimestampSeconds",
    );
    return { waitSeconds: contactTimestampSeconds - requestTimestampSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestTimestampSeconds: 1000, contactTimestampSeconds: 2800 },
  output: { waitSeconds: 1800 },
} satisfies ToolExample<Input, Output>;
export const legalAidContactWaitDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/legal-aid-contact-wait-duration",
    title: "Legal Aid Contact Wait Duration",
    description:
      "Measure an ordered recorded legal-aid request-to-contact interval without determining legal service deadlines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestTimestampSeconds: { type: "number" },
        contactTimestampSeconds: { type: "number" },
      },
      required: ["requestTimestampSeconds", "contactTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { waitSeconds: { type: "number" } },
      required: ["waitSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "requestTimestampSeconds",
          label: "Request Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactTimestampSeconds",
          label: "Contact Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waitSeconds",
          label: "Wait Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = legalAidContactWaitDurationTool.execute;
export default legalAidContactWaitDurationTool;
