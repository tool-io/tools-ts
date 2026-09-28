import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPixels: number;
  readonly referencePixels: number;
  readonly lengthPerPixel: number;
};
export type Output = { readonly lengthGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPixels: { type: "number", minimum: 0 },
    referencePixels: { type: "number", minimum: 0 },
    lengthPerPixel: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredPixels", "referencePixels", "lengthPerPixel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lengthGap: { type: "number" } },
  required: ["lengthGap"],
} as const;
/** Calculate image reference length gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPixels, referencePixels, lengthPerPixel } = request;
  const compute = (): Output => {
    H.domain(measuredPixels >= 0 && referencePixels >= 0);
    H.positive(lengthPerPixel);
    return { lengthGap: (measuredPixels - referencePixels) * lengthPerPixel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredPixels: 120, referencePixels: 100, lengthPerPixel: 0.1 },
  output: { lengthGap: 2 },
} satisfies ToolExample<Input, Output>;
export const imageReferenceLengthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gynecology/image-reference-length-gap",
    title: "Image Reference Length Gap Tool",
    description:
      "Calculate image reference length gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPixels: { type: "number", minimum: 0 },
        referencePixels: { type: "number", minimum: 0 },
        lengthPerPixel: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredPixels", "referencePixels", "lengthPerPixel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lengthGap: { type: "number" } },
      required: ["lengthGap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPixels",
          label: "Measured Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePixels",
          label: "Reference Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lengthPerPixel",
          label: "Length Per Pixel",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lengthGap", label: "Length Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = imageReferenceLengthGapTool.execute;
export default imageReferenceLengthGapTool;
