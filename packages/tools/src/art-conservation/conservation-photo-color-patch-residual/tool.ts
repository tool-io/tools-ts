import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceChannelValue: number;
  readonly measuredChannelValue: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceChannelValue: { type: "number" },
    measuredChannelValue: { type: "number" },
  },
  required: ["referenceChannelValue", "measuredChannelValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed measured-minus-reference value for one supplied photo color-patch channel without color-space conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceChannelValue, measuredChannelValue } = request;
  const compute = (): Output => {
    return { signedGap: measuredChannelValue - referenceChannelValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceChannelValue: 12, measuredChannelValue: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const conservationPhotoColorPatchResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["art-conservation", "art conservation", "arts and design"],
        keywords: ["art conservation", "arts and design"],
      },
      id: "art-conservation/conservation-photo-color-patch-residual",
      title: "Conservation Photo Color Patch Residual",
      description:
        "Calculate signed measured-minus-reference value for one supplied photo color-patch channel without color-space conversion.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceChannelValue: { type: "number" },
          measuredChannelValue: { type: "number" },
        },
        required: ["referenceChannelValue", "measuredChannelValue"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "referenceChannelValue",
            label: "Reference Channel Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredChannelValue",
            label: "Measured Channel Value",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = conservationPhotoColorPatchResidualTool.execute;
export default conservationPhotoColorPatchResidualTool;
