import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageDistancePixels: number;
  readonly referencePixels: number;
  readonly referenceLength: number;
};
export type Output = { readonly physicalDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageDistancePixels: { type: "number", minimum: 0 },
    referencePixels: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
  },
  required: ["imageDistancePixels", "referencePixels", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { physicalDistance: { type: "number" } },
  required: ["physicalDistance"],
} as const;
/** Scale one supplied plaque-image pixel distance using an explicit same-plane physical reference without segmenting plaque. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageDistancePixels, referencePixels, referenceLength } = request;
  const compute = (): Output => {
    H.domain(imageDistancePixels >= 0, "imageDistancePixels");
    (H.domain(
      Number.isFinite(referencePixels) && referencePixels > 0,
      "referencePixels",
    ),
      referencePixels);
    H.domain(referenceLength >= 0, "referenceLength");
    return {
      physicalDistance:
        (imageDistancePixels / referencePixels) * referenceLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageDistancePixels: 120, referencePixels: 60, referenceLength: 5 },
  output: { physicalDistance: 10 },
} satisfies ToolExample<Input, Output>;
export const plaqueDisclosureImageScaleRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/plaque-disclosure-image-scale-ratio",
    title: "Plaque Disclosure Image Scale Ratio Tool",
    description:
      "Scale one supplied plaque-image pixel distance using an explicit same-plane physical reference without segmenting plaque.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageDistancePixels: { type: "number", minimum: 0 },
        referencePixels: { type: "number", exclusiveMinimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
      },
      required: ["imageDistancePixels", "referencePixels", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { physicalDistance: { type: "number" } },
      required: ["physicalDistance"],
    },
    ports: {
      inputs: [
        {
          id: "imageDistancePixels",
          label: "Image Distance Pixels",
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
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalDistance",
          label: "Physical Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = plaqueDisclosureImageScaleRatioTool.execute;
export default plaqueDisclosureImageScaleRatioTool;
