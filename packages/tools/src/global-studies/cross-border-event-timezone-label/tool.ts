import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventCode: string;
  readonly localTimeText: string;
  readonly timezoneWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventCode: { type: "string", maxLength: 8192, minLength: 1 },
    localTimeText: { type: "string", maxLength: 8192, minLength: 1 },
    timezoneWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["eventCode", "localTimeText", "timezoneWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label supplied local time text and time-zone wording without parsing offsets or resolving daylight-saving rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventCode, localTimeText, timezoneWording } = request;
  const compute = (): Output => {
    H.domain(
      eventCode.length > 0 &&
        localTimeText.length > 0 &&
        timezoneWording.length > 0,
      "eventCode",
    );
    return {
      label:
        eventCode +
        "; " +
        JSON.stringify(localTimeText) +
        " [" +
        timezoneWording +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventCode: "E17",
    localTimeText: "2026-11-01 10:30",
    timezoneWording: "Europe/Berlin",
  },
  output: { label: 'E17; "2026-11-01 10:30" [Europe/Berlin]' },
} satisfies ToolExample<Input, Output>;
export const crossBorderEventTimezoneLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["global-studies", "global studies", "social sciences"],
      keywords: ["global studies", "social sciences"],
    },
    id: "global-studies/cross-border-event-timezone-label",
    title: "Cross Border Event Timezone Label",
    description:
      "Label supplied local time text and time-zone wording without parsing offsets or resolving daylight-saving rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventCode: { type: "string", maxLength: 8192, minLength: 1 },
        localTimeText: { type: "string", maxLength: 8192, minLength: 1 },
        timezoneWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["eventCode", "localTimeText", "timezoneWording"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "eventCode",
          label: "Event Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "localTimeText",
          label: "Local Time Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "timezoneWording",
          label: "Timezone Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = crossBorderEventTimezoneLabelTool.execute;
export default crossBorderEventTimezoneLabelTool;
