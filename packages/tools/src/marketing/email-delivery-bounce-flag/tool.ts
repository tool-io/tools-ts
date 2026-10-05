import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly deliveryStatus: string };
export type Output = { readonly bounced: boolean; readonly retryClass: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveryStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["delivered", "temporary-failure", "permanent-failure", "pending"],
    },
  },
  required: ["deliveryStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bounced: { type: "boolean" },
    retryClass: { type: "string", maxLength: 8192 },
  },
  required: ["bounced", "retryClass"],
} as const;
/** Render an explicitly supplied email delivery status without attempting delivery or diagnosing an SMTP response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deliveryStatus } = request;
  const compute = (): Output => {
    H.domain(
      [
        "delivered",
        "temporary-failure",
        "permanent-failure",
        "pending",
      ].includes(deliveryStatus),
      "deliveryStatus",
    );
    return {
      bounced:
        deliveryStatus === "temporary-failure" ||
        deliveryStatus === "permanent-failure",
      retryClass:
        deliveryStatus === "temporary-failure"
          ? "temporary"
          : deliveryStatus === "permanent-failure"
            ? "permanent"
            : "not-a-failure",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deliveryStatus: "temporary-failure" },
  output: { bounced: true, retryClass: "temporary" },
} satisfies ToolExample<Input, Output>;
export const emailDeliveryBounceFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/email-delivery-bounce-flag",
    title: "Email Delivery Bounce Flag Tool",
    description:
      "Render an explicitly supplied email delivery status without attempting delivery or diagnosing an SMTP response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveryStatus: {
          type: "string",
          maxLength: 8192,
          enum: [
            "delivered",
            "temporary-failure",
            "permanent-failure",
            "pending",
          ],
        },
      },
      required: ["deliveryStatus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bounced: { type: "boolean" },
        retryClass: { type: "string", maxLength: 8192 },
      },
      required: ["bounced", "retryClass"],
    },
    ports: {
      inputs: [
        {
          id: "deliveryStatus",
          label: "Delivery Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "bounced", label: "Bounced", valueType: { type: "boolean" } },
        {
          id: "retryClass",
          label: "Retry Class",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = emailDeliveryBounceFlagTool.execute;
export default emailDeliveryBounceFlagTool;
