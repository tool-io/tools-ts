import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clickedRecorded: boolean;
  readonly unsubscribedRecorded: boolean;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clickedRecorded: { type: "boolean" },
    unsubscribedRecorded: { type: "boolean" },
  },
  required: ["clickedRecorded", "unsubscribedRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Combine explicit newsletter click and unsubscribe flags without attributing intent or sending messages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clickedRecorded, unsubscribedRecorded } = request;
  const compute = (): Output => {
    return {
      status: clickedRecorded
        ? unsubscribedRecorded
          ? "clicked-and-unsubscribed"
          : "clicked"
        : unsubscribedRecorded
          ? "unsubscribed"
          : "neither-recorded",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clickedRecorded: true, unsubscribedRecorded: true },
  output: { status: "clicked-and-unsubscribed" },
} satisfies ToolExample<Input, Output>;
export const newsletterClickUnsubscribeStatusPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["marketing", "business and finance"],
        keywords: ["marketing", "business and finance"],
      },
      id: "marketing/newsletter-click-unsubscribe-status-pair",
      title: "Newsletter Click Unsubscribe Status Pair",
      description:
        "Combine explicit newsletter click and unsubscribe flags without attributing intent or sending messages.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          clickedRecorded: { type: "boolean" },
          unsubscribedRecorded: { type: "boolean" },
        },
        required: ["clickedRecorded", "unsubscribedRecorded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { status: { type: "string", maxLength: 8192 } },
        required: ["status"],
      },
      ports: {
        inputs: [
          {
            id: "clickedRecorded",
            label: "Clicked Recorded",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "unsubscribedRecorded",
            label: "Unsubscribed Recorded",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "status", label: "Status", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = newsletterClickUnsubscribeStatusPairTool.execute;
export default newsletterClickUnsubscribeStatusPairTool;
