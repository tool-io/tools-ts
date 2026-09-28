import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purposes: readonly string[];
  readonly channels: readonly string[];
  readonly purpose: string;
  readonly channel: string;
  readonly active: boolean;
  readonly day: number;
  readonly expiryDay: number;
  readonly inclusive: boolean;
};
export type Output = {
  readonly purposeMatch: boolean;
  readonly channelMatch: boolean;
  readonly unexpired: boolean;
  readonly eligible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    channels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    purpose: { type: "string", maxLength: 8192 },
    channel: { type: "string", maxLength: 8192 },
    active: { type: "boolean" },
    day: { type: "integer" },
    expiryDay: { type: "integer" },
    inclusive: { type: "boolean" },
  },
  required: [
    "purposes",
    "channels",
    "purpose",
    "channel",
    "active",
    "day",
    "expiryDay",
    "inclusive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purposeMatch: { type: "boolean" },
    channelMatch: { type: "boolean" },
    unexpired: { type: "boolean" },
    eligible: { type: "boolean" },
  },
  required: ["purposeMatch", "channelMatch", "unexpired", "eligible"],
} as const;
/** Check supplied contact purpose/channel permissions and expiry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    purposes,
    channels,
    purpose,
    channel,
    active,
    day,
    expiryDay,
    inclusive,
  } = request;
  const compute = (): Output => {
    H.domain(purpose.length > 0 && channel.length > 0, "purpose");
    const purposeMatch = purposes.includes(purpose),
      channelMatch = channels.includes(channel),
      unexpired = inclusive ? day <= expiryDay : day < expiryDay;
    return {
      purposeMatch,
      channelMatch,
      unexpired,
      eligible: active && purposeMatch && channelMatch && unexpired,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    purposes: ["followup"],
    channels: ["email"],
    purpose: "followup",
    channel: "email",
    active: true,
    day: 100,
    expiryDay: 110,
    inclusive: false,
  },
  output: {
    purposeMatch: true,
    channelMatch: true,
    unexpired: true,
    eligible: true,
  },
} satisfies ToolExample<Input, Output>;
export const gynecologicStudyContactConsentMatchTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gynecology/gynecologic-study-contact-consent-match",
      title: "Gynecologic Study Contact Consent Match Tool",
      description:
        "Check supplied contact purpose/channel permissions and expiry.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          purposes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          channels: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          purpose: { type: "string", maxLength: 8192 },
          channel: { type: "string", maxLength: 8192 },
          active: { type: "boolean" },
          day: { type: "integer" },
          expiryDay: { type: "integer" },
          inclusive: { type: "boolean" },
        },
        required: [
          "purposes",
          "channels",
          "purpose",
          "channel",
          "active",
          "day",
          "expiryDay",
          "inclusive",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          purposeMatch: { type: "boolean" },
          channelMatch: { type: "boolean" },
          unexpired: { type: "boolean" },
          eligible: { type: "boolean" },
        },
        required: ["purposeMatch", "channelMatch", "unexpired", "eligible"],
      },
      ports: {
        inputs: [
          {
            id: "purposes",
            label: "Purposes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "channels",
            label: "Channels",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "purpose",
            label: "Purpose",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "channel",
            label: "Channel",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "active",
            label: "Active",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "day",
            label: "Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "expiryDay",
            label: "Expiry Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "inclusive",
            label: "Inclusive",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "purposeMatch",
            label: "Purpose Match",
            valueType: { type: "boolean" },
          },
          {
            id: "channelMatch",
            label: "Channel Match",
            valueType: { type: "boolean" },
          },
          {
            id: "unexpired",
            label: "Unexpired",
            valueType: { type: "boolean" },
          },
          { id: "eligible", label: "Eligible", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = gynecologicStudyContactConsentMatchTool.execute;
export default gynecologicStudyContactConsentMatchTool;
