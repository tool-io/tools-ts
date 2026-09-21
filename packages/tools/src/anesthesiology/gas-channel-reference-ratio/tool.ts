import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelValue: number;
  readonly referenceValue: number;
};
export type Output = { readonly ratio: number };
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
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Compare supplied nonclinical gas-channel readings on the same basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelValue, referenceValue } = request;
  const compute = (): Output => {
    H.domain(referenceValue !== 0);
    return { ratio: channelValue / referenceValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { channelValue: 12, referenceValue: 10 },
  output: { ratio: 1.2 },
} satisfies ToolExample<Input, Output>;
export const gasChannelReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/gas-channel-reference-ratio",
    title: "Gas Channel Reference Ratio Tool",
    description:
      "Compare supplied nonclinical gas-channel readings on the same basis.",
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
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
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
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = gasChannelReferenceRatioTool.execute;
export default gasChannelReferenceRatioTool;
