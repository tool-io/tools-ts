import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly edgeLength: number;
  readonly sampledLength: number;
};
export type Output = { readonly unsampledLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeLength: { type: "number", minimum: 0 },
    sampledLength: { type: "number", minimum: 0 },
  },
  required: ["edgeLength", "sampledLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unsampledLength: { type: "number" } },
  required: ["unsampledLength"],
} as const;
/** Subtract surveyed habitat-edge length from supplied total edge length, preserving overlapping-effort discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edgeLength, sampledLength } = request;
  const compute = (): Output => {
    H.domain(edgeLength >= 0, "edgeLength");
    H.domain(sampledLength >= 0, "sampledLength");
    return { unsampledLength: edgeLength - sampledLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edgeLength: 120, sampledLength: 45 },
  output: { unsampledLength: 75 },
} satisfies ToolExample<Input, Output>;
export const habitatEdgeUnsampledLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/habitat-edge-unsampled-length",
    title: "Habitat Edge Unsampled Length",
    description:
      "Subtract surveyed habitat-edge length from supplied total edge length, preserving overlapping-effort discrepancies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeLength: { type: "number", minimum: 0 },
        sampledLength: { type: "number", minimum: 0 },
      },
      required: ["edgeLength", "sampledLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unsampledLength: { type: "number" } },
      required: ["unsampledLength"],
    },
    ports: {
      inputs: [
        {
          id: "edgeLength",
          label: "Edge Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledLength",
          label: "Sampled Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unsampledLength",
          label: "Unsampled Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = habitatEdgeUnsampledLengthTool.execute;
export default habitatEdgeUnsampledLengthTool;
