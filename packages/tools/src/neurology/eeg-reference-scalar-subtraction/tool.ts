import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelValue: number;
  readonly referenceValue: number;
};
export type Output = { readonly referencedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channelValue: { type: "number" },
    referenceValue: { type: "number" },
  },
  required: ["channelValue", "referenceValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referencedValue: { type: "number" } },
  required: ["referencedValue"],
} as const;
/** Subtract one explicitly supplied EEG reference value without constructing or selecting a montage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelValue, referenceValue } = request;
  const compute = (): Output => {
    return { referencedValue: channelValue - referenceValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { channelValue: 12, referenceValue: 4 },
  output: { referencedValue: 8 },
} satisfies ToolExample<Input, Output>;
export const eegReferenceScalarSubtractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neurology", "health and medicine"],
      keywords: ["neurology", "health and medicine"],
    },
    id: "neurology/eeg-reference-scalar-subtraction",
    title: "EEG Reference Scalar Subtraction",
    description:
      "Subtract one explicitly supplied EEG reference value without constructing or selecting a montage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channelValue: { type: "number" },
        referenceValue: { type: "number" },
      },
      required: ["channelValue", "referenceValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referencedValue: { type: "number" } },
      required: ["referencedValue"],
    },
    ports: {
      inputs: [
        {
          id: "channelValue",
          label: "Channel Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceValue",
          label: "Reference Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referencedValue",
          label: "Referenced Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eegReferenceScalarSubtractionTool.execute;
export default eegReferenceScalarSubtractionTool;
