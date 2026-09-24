import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTime: number;
  readonly interpretedTime: number;
  readonly sourceOffset: number;
  readonly interpretationOffset: number;
};
export type Output = {
  readonly referenceDelay: number;
  readonly interpretedLeads: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTime: { type: "number" },
    interpretedTime: { type: "number" },
    sourceOffset: { type: "number" },
    interpretationOffset: { type: "number" },
  },
  required: [
    "sourceTime",
    "interpretedTime",
    "sourceOffset",
    "interpretationOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDelay: { type: "number" },
    interpretedLeads: { type: "boolean" },
  },
  required: ["referenceDelay", "interpretedLeads"],
} as const;
/** Offsets are recorded clock minus common reference time; a negative delay is preserved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceTime, interpretedTime, sourceOffset, interpretationOffset } =
    request;
  const compute = (): Output => {
    return {
      referenceDelay:
        interpretedTime - interpretationOffset - sourceTime + sourceOffset,
      interpretedLeads:
        interpretedTime - interpretationOffset < sourceTime - sourceOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceTime: 10,
    interpretedTime: 12,
    sourceOffset: 1,
    interpretationOffset: 0,
  },
  output: { referenceDelay: 3, interpretedLeads: false },
} satisfies ToolExample<Input, Output>;
export const interpretationChannelDelaySignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/interpretation-channel-delay-sign",
    title: "Interpretation Channel Delay Sign Tool",
    description:
      "Offsets are recorded clock minus common reference time; a negative delay is preserved.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTime: { type: "number" },
        interpretedTime: { type: "number" },
        sourceOffset: { type: "number" },
        interpretationOffset: { type: "number" },
      },
      required: [
        "sourceTime",
        "interpretedTime",
        "sourceOffset",
        "interpretationOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDelay: { type: "number" },
        interpretedLeads: { type: "boolean" },
      },
      required: ["referenceDelay", "interpretedLeads"],
    },
    ports: {
      inputs: [
        {
          id: "sourceTime",
          label: "Source Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interpretedTime",
          label: "Interpreted Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceOffset",
          label: "Source Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interpretationOffset",
          label: "Interpretation Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceDelay",
          label: "Reference Delay",
          valueType: { type: "number" },
        },
        {
          id: "interpretedLeads",
          label: "Interpreted Leads",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = interpretationChannelDelaySignTool.execute;
export default interpretationChannelDelaySignTool;
