import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localMinute: number;
  readonly startMinute: number;
  readonly endMinute: number;
  readonly permittedDays: readonly number[];
  readonly localDay: number;
  readonly channel: string;
  readonly allowedChannels: readonly string[];
};
export type Output = {
  readonly timeAllowed: boolean;
  readonly dayAllowed: boolean;
  readonly channelAllowed: boolean;
  readonly matches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localMinute: { type: "integer", minimum: 0, maximum: 1439 },
    startMinute: { type: "integer", minimum: 0, maximum: 1439 },
    endMinute: { type: "integer", minimum: 0, maximum: 1439 },
    permittedDays: { type: "array", maxItems: 256, items: { type: "integer" } },
    localDay: { type: "integer", minimum: 0, maximum: 6 },
    channel: { type: "string", maxLength: 8192 },
    allowedChannels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "localMinute",
    "startMinute",
    "endMinute",
    "permittedDays",
    "localDay",
    "channel",
    "allowedChannels",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeAllowed: { type: "boolean" },
    dayAllowed: { type: "boolean" },
    channelAllowed: { type: "boolean" },
    matches: { type: "boolean" },
  },
  required: ["timeAllowed", "dayAllowed", "channelAllowed", "matches"],
} as const;
/** Check supplied local clock/day/channel contact permissions without named-zone inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    localMinute,
    startMinute,
    endMinute,
    permittedDays,
    localDay,
    channel,
    allowedChannels,
  } = request;
  const compute = (): Output => {
    H.integer(localMinute, 0, 1439);
    H.integer(startMinute, 0, 1439);
    H.integer(endMinute, 0, 1439);
    H.integer(localDay, 0, 6);
    H.domain(permittedDays.every((x) => x >= 0 && x <= 6));
    const timeAllowed =
        startMinute <= endMinute
          ? localMinute >= startMinute && localMinute < endMinute
          : localMinute >= startMinute || localMinute < endMinute,
      dayAllowed = permittedDays.includes(localDay),
      channelAllowed = allowedChannels.includes(channel);
    return {
      timeAllowed,
      dayAllowed,
      channelAllowed,
      matches: timeAllowed && dayAllowed && channelAllowed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    localMinute: 600,
    startMinute: 540,
    endMinute: 1020,
    permittedDays: [1, 2, 3, 4, 5],
    localDay: 2,
    channel: "phone",
    allowedChannels: ["phone"],
  },
  output: {
    timeAllowed: true,
    dayAllowed: true,
    channelAllowed: true,
    matches: true,
  },
} satisfies ToolExample<Input, Output>;
export const gcpSiteContactSafeWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-site-contact-safe-window",
    title: "GCP Site Contact Safe Window Tool",
    description:
      "Check supplied local clock/day/channel contact permissions without named-zone inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        localMinute: { type: "integer", minimum: 0, maximum: 1439 },
        startMinute: { type: "integer", minimum: 0, maximum: 1439 },
        endMinute: { type: "integer", minimum: 0, maximum: 1439 },
        permittedDays: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        localDay: { type: "integer", minimum: 0, maximum: 6 },
        channel: { type: "string", maxLength: 8192 },
        allowedChannels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "localMinute",
        "startMinute",
        "endMinute",
        "permittedDays",
        "localDay",
        "channel",
        "allowedChannels",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeAllowed: { type: "boolean" },
        dayAllowed: { type: "boolean" },
        channelAllowed: { type: "boolean" },
        matches: { type: "boolean" },
      },
      required: ["timeAllowed", "dayAllowed", "channelAllowed", "matches"],
    },
    ports: {
      inputs: [
        {
          id: "localMinute",
          label: "Local Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "startMinute",
          label: "Start Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endMinute",
          label: "End Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "permittedDays",
          label: "Permitted Days",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "localDay",
          label: "Local Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "channel",
          label: "Channel",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedChannels",
          label: "Allowed Channels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "timeAllowed",
          label: "Time Allowed",
          valueType: { type: "boolean" },
        },
        {
          id: "dayAllowed",
          label: "Day Allowed",
          valueType: { type: "boolean" },
        },
        {
          id: "channelAllowed",
          label: "Channel Allowed",
          valueType: { type: "boolean" },
        },
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gcpSiteContactSafeWindowTool.execute;
export default gcpSiteContactSafeWindowTool;
