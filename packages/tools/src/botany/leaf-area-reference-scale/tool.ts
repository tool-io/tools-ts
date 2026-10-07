import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPixels: number;
  readonly referencePixels: number;
  readonly referenceArea: number;
};
export type Output = { readonly leafArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPixels: { type: "number", minimum: 0 },
    referencePixels: { type: "number", exclusiveMinimum: 0 },
    referenceArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredPixels", "referencePixels", "referenceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leafArea: { type: "number" } },
  required: ["leafArea"],
} as const;
/** Scale an explicit segmented leaf-pixel area to a supplied coplanar reference area without segmenting an image. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPixels, referencePixels, referenceArea } = request;
  const compute = (): Output => {
    H.domain(measuredPixels >= 0, "measuredPixels");
    (H.domain(referencePixels > 0, "referencePixels"), referencePixels);
    (H.domain(referenceArea > 0, "referenceArea"), referenceArea);
    return { leafArea: (measuredPixels * referenceArea) / referencePixels };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredPixels: 600, referencePixels: 100, referenceArea: 2 },
  output: { leafArea: 12 },
} satisfies ToolExample<Input, Output>;
export const leafAreaReferenceScaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["botany", "biology"],
      keywords: ["botany", "biology"],
    },
    id: "botany/leaf-area-reference-scale",
    title: "Leaf Area Reference Scale",
    description:
      "Scale an explicit segmented leaf-pixel area to a supplied coplanar reference area without segmenting an image.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPixels: { type: "number", minimum: 0 },
        referencePixels: { type: "number", exclusiveMinimum: 0 },
        referenceArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredPixels", "referencePixels", "referenceArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { leafArea: { type: "number" } },
      required: ["leafArea"],
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
          id: "referenceArea",
          label: "Reference Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "leafArea", label: "Leaf Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = leafAreaReferenceScaleTool.execute;
export default leafAreaReferenceScaleTool;
