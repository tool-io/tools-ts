import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageId: string;
  readonly lateralityCode: string;
  readonly codeSource: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    lateralityCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["imageId", "lateralityCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Record an explicit radiology laterality code and source without inferring side from image pixels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, lateralityCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(
      imageId.length > 0 && lateralityCode.length > 0 && codeSource.length > 0,
      "imageId",
    );
    return { tag: JSON.stringify([imageId, lateralityCode, codeSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageId: "IMG17", lateralityCode: "L", codeSource: "DICOM record" },
  output: { tag: '["IMG17","L","DICOM record"]' },
} satisfies ToolExample<Input, Output>;
export const radiologyLateralityTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["radiology", "health and medicine"],
      keywords: ["radiology", "health and medicine"],
    },
    id: "radiology/radiology-laterality-tag",
    title: "Radiology Laterality Tag",
    description:
      "Record an explicit radiology laterality code and source without inferring side from image pixels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        lateralityCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["imageId", "lateralityCode", "codeSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "imageId",
          label: "Image Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lateralityCode",
          label: "Laterality Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = radiologyLateralityTagTool.execute;
export default radiologyLateralityTagTool;
