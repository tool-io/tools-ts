import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channels: readonly string[];
  readonly permitted: readonly string[];
  readonly withdrawn: readonly string[];
};
export type Output = {
  readonly allowed: readonly boolean[];
  readonly allowedChannels: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    permitted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    withdrawn: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["channels", "permitted", "withdrawn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    allowedChannels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["allowed", "allowedChannels"],
} as const;
/** Apply explicit permission and withdrawal channel lists. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channels, permitted, withdrawn } = request;
  const compute = (): Output => {
    H.domain(new Set(channels).size === channels.length, "channels");
    const allowed = channels.map(
      (x) => permitted.includes(x) && !withdrawn.includes(x),
    );
    return { allowed, allowedChannels: channels.filter((_, i) => allowed[i]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    channels: ["email", "phone", "post"],
    permitted: ["email", "phone"],
    withdrawn: ["phone"],
  },
  output: { allowed: [true, false, false], allowedChannels: ["email"] },
} satisfies ToolExample<Input, Output>;
export const nursingContactConsentedChannelMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/nursing-contact-consented-channel-mask",
    title: "Nursing Contact Consented Channel Mask Tool",
    description: "Apply explicit permission and withdrawal channel lists.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        permitted: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        withdrawn: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["channels", "permitted", "withdrawn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allowed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        allowedChannels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["allowed", "allowedChannels"],
    },
    ports: {
      inputs: [
        {
          id: "channels",
          label: "Channels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "permitted",
          label: "Permitted",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "withdrawn",
          label: "Withdrawn",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "allowed",
          label: "Allowed",
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "allowedChannels",
          label: "Allowed Channels",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = nursingContactConsentedChannelMaskTool.execute;
export default nursingContactConsentedChannelMaskTool;
