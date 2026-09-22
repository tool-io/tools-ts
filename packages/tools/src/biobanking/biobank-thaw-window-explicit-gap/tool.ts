import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventStart: number;
  readonly eventEnd: number;
  readonly allowedStart: number;
  readonly allowedEnd: number;
};
export type Output = {
  readonly lowerSlack: number;
  readonly upperSlack: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventStart: { type: "number" },
    eventEnd: { type: "number" },
    allowedStart: { type: "number" },
    allowedEnd: { type: "number" },
  },
  required: ["eventStart", "eventEnd", "allowedStart", "allowedEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerSlack: { type: "number" },
    upperSlack: { type: "number" },
    inside: { type: "boolean" },
  },
  required: ["lowerSlack", "upperSlack", "inside"],
} as const;
/** Audit recorded event timing against supplied bounds without selecting handling conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventStart, eventEnd, allowedStart, allowedEnd } = request;
  const compute = (): Output => {
    H.domain(eventEnd >= eventStart && allowedEnd >= allowedStart);
    return {
      lowerSlack: eventStart - allowedStart,
      upperSlack: allowedEnd - eventEnd,
      inside: eventStart >= allowedStart && eventEnd <= allowedEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventStart: 110, eventEnd: 115, allowedStart: 100, allowedEnd: 120 },
  output: { lowerSlack: 10, upperSlack: 5, inside: true },
} satisfies ToolExample<Input, Output>;
export const biobankThawWindowExplicitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/biobank-thaw-window-explicit-gap",
    title: "Biobank Thaw Window Explicit Gap Tool",
    description:
      "Audit recorded event timing against supplied bounds without selecting handling conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventStart: { type: "number" },
        eventEnd: { type: "number" },
        allowedStart: { type: "number" },
        allowedEnd: { type: "number" },
      },
      required: ["eventStart", "eventEnd", "allowedStart", "allowedEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerSlack: { type: "number" },
        upperSlack: { type: "number" },
        inside: { type: "boolean" },
      },
      required: ["lowerSlack", "upperSlack", "inside"],
    },
    ports: {
      inputs: [
        {
          id: "eventStart",
          label: "Event Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventEnd",
          label: "Event End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedStart",
          label: "Allowed Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowedEnd",
          label: "Allowed End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerSlack",
          label: "Lower Slack",
          valueType: { type: "number" },
        },
        {
          id: "upperSlack",
          label: "Upper Slack",
          valueType: { type: "number" },
        },
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = biobankThawWindowExplicitGapTool.execute;
export default biobankThawWindowExplicitGapTool;
