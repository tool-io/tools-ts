import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channel: number;
  readonly reference: number;
  readonly subtractReference: boolean;
};
export type Output = {
  readonly value: number;
  readonly removedReference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channel: { type: "number" },
    reference: { type: "number" },
    subtractReference: { type: "boolean" },
  },
  required: ["channel", "reference", "subtractReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    removedReference: { type: "number" },
  },
  required: ["value", "removedReference"],
} as const;
/** Apply an explicit common-reference subtraction flag to one recorded channel. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channel, reference, subtractReference } = request;
  const compute = (): Output => {
    return {
      value: channel - (subtractReference ? reference : 0),
      removedReference: subtractReference ? reference : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { channel: 12, reference: 3, subtractReference: true },
  output: { value: 9, removedReference: 3 },
} satisfies ToolExample<Input, Output>;
export const channelReferenceCommonModeFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/channel-reference-common-mode-flag",
    title: "Channel Reference Common Mode Flag Tool",
    description:
      "Apply an explicit common-reference subtraction flag to one recorded channel.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channel: { type: "number" },
        reference: { type: "number" },
        subtractReference: { type: "boolean" },
      },
      required: ["channel", "reference", "subtractReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        removedReference: { type: "number" },
      },
      required: ["value", "removedReference"],
    },
    ports: {
      inputs: [
        {
          id: "channel",
          label: "Channel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subtractReference",
          label: "Subtract Reference",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "number" } },
        {
          id: "removedReference",
          label: "Removed Reference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = channelReferenceCommonModeFlagTool.execute;
export default channelReferenceCommonModeFlagTool;
