import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstScale: number;
  readonly firstOffset: number;
  readonly secondScale: number;
  readonly secondOffset: number;
};
export type Output = { readonly scale: number; readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstScale: { type: "number" },
    firstOffset: { type: "number" },
    secondScale: { type: "number" },
    secondOffset: { type: "number" },
  },
  required: ["firstScale", "firstOffset", "secondScale", "secondOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scale: { type: "number" }, offset: { type: "number" } },
  required: ["scale", "offset"],
} as const;
/** Calculate affine normalizer parameter compose from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstScale, firstOffset, secondScale, secondOffset } = input;
  const compute = (): Output => {
    return {
      scale: secondScale * firstScale,
      offset: secondScale * firstOffset + secondOffset,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstScale: 2, firstOffset: 3, secondScale: 4, secondOffset: 5 },
  output: { scale: 8, offset: 17 },
} satisfies ToolExample<Input, Output>;
export const affineNormalizerParameterComposeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/affine-normalizer-parameter-compose",
    title: "Affine Normalizer Parameter Compose Tool",
    description:
      "Calculate affine normalizer parameter compose from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstScale: { type: "number" },
        firstOffset: { type: "number" },
        secondScale: { type: "number" },
        secondOffset: { type: "number" },
      },
      required: ["firstScale", "firstOffset", "secondScale", "secondOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scale: { type: "number" }, offset: { type: "number" } },
      required: ["scale", "offset"],
    },
    ports: {
      inputs: [
        {
          id: "firstScale",
          label: "First Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOffset",
          label: "First Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondScale",
          label: "Second Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOffset",
          label: "Second Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "scale", label: "Scale", valueType: { type: "number" } },
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = affineNormalizerParameterComposeTool.execute;
export default affineNormalizerParameterComposeTool;
