import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cropBatchId: string;
  readonly rootzoneWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cropBatchId: { type: "string", maxLength: 8192, minLength: 1 },
    rootzoneWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["cropBatchId", "rootzoneWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify explicit root-zone wording by source without selecting growing conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cropBatchId, rootzoneWording, source } = request;
  const compute = (): Output => {
    H.domain(cropBatchId.length > 0, "cropBatchId");
    H.domain(rootzoneWording.length > 0, "rootzoneWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([cropBatchId, rootzoneWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cropBatchId: "B17",
    rootzoneWording: "channel A",
    source: "Farm record",
  },
  output: { token: '["B17","channel A","Farm record"]' },
} satisfies ToolExample<Input, Output>;
export const hydroponicRootzoneLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["hydroponics", "agriculture"],
      keywords: ["hydroponics", "agriculture"],
    },
    id: "hydroponics/hydroponic-root-zone-label",
    title: "Hydroponic Root Zone Label",
    description:
      "Qualify explicit root-zone wording by source without selecting growing conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cropBatchId: { type: "string", maxLength: 8192, minLength: 1 },
        rootzoneWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["cropBatchId", "rootzoneWording", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "cropBatchId",
          label: "Crop Batch Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rootzoneWording",
          label: "Rootzone Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hydroponicRootzoneLabelTool.execute;
export default hydroponicRootzoneLabelTool;
