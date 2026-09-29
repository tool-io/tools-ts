import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly verticalDrop: number;
  readonly horizontalLength: number;
};
export type Output = { readonly signedSlope: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verticalDrop: { type: "number" },
    horizontalLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["verticalDrop", "horizontalLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedSlope: { type: "number" } },
  required: ["signedSlope"],
} as const;
/** Calculate channel drop length ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { verticalDrop, horizontalLength } = request;
  const compute = (): Output => {
    H.positive(horizontalLength);
    return { signedSlope: verticalDrop / horizontalLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { verticalDrop: 2, horizontalLength: 100 },
  output: { signedSlope: 0.02 },
} satisfies ToolExample<Input, Output>;
export const channelDropLengthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/channel-drop-length-ratio",
    title: "Channel Drop Length Ratio Tool",
    description:
      "Calculate channel drop length ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verticalDrop: { type: "number" },
        horizontalLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["verticalDrop", "horizontalLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedSlope: { type: "number" } },
      required: ["signedSlope"],
    },
    ports: {
      inputs: [
        {
          id: "verticalDrop",
          label: "Vertical Drop",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalLength",
          label: "Horizontal Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedSlope",
          label: "Signed Slope",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = channelDropLengthRatioTool.execute;
export default channelDropLengthRatioTool;
