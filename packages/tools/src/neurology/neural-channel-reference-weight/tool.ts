import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelValue: number;
  readonly referenceValue: number;
  readonly referenceWeight: number;
};
export type Output = {
  readonly referencedValue: number;
  readonly referenceContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channelValue: { type: "number" },
    referenceValue: { type: "number" },
    referenceWeight: { type: "number" },
  },
  required: ["channelValue", "referenceValue", "referenceWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referencedValue: { type: "number" },
    referenceContribution: { type: "number" },
  },
  required: ["referencedValue", "referenceContribution"],
} as const;
/** Apply one supplied linear research-channel reference term without choosing a montage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelValue, referenceValue, referenceWeight } = request;
  const compute = (): Output => {
    return {
      referencedValue: channelValue - referenceWeight * referenceValue,
      referenceContribution: referenceWeight * referenceValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { channelValue: 12, referenceValue: 4, referenceWeight: 0.5 },
  output: { referencedValue: 10, referenceContribution: 2 },
} satisfies ToolExample<Input, Output>;
export const neuralChannelReferenceWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neurology/neural-channel-reference-weight",
    title: "Neural Channel Reference Weight Tool",
    description:
      "Apply one supplied linear research-channel reference term without choosing a montage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channelValue: { type: "number" },
        referenceValue: { type: "number" },
        referenceWeight: { type: "number" },
      },
      required: ["channelValue", "referenceValue", "referenceWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referencedValue: { type: "number" },
        referenceContribution: { type: "number" },
      },
      required: ["referencedValue", "referenceContribution"],
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
        {
          id: "referenceWeight",
          label: "Reference Weight",
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
        {
          id: "referenceContribution",
          label: "Reference Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = neuralChannelReferenceWeightTool.execute;
export default neuralChannelReferenceWeightTool;
