import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly imageId: string; readonly edgeStatus: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    edgeStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["complete", "partial", "uncertain", "not-assessed"],
    },
  },
  required: ["imageId", "edgeStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied otolith edge status without counting annuli or assigning age. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, edgeStatus } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0, "imageId");
    H.domain(
      ["complete", "partial", "uncertain", "not-assessed"].includes(edgeStatus),
      "edgeStatus",
    );
    return { label: imageId + " [" + edgeStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageId: "I17", edgeStatus: "partial" },
  output: { label: "I17 [partial]" },
} satisfies ToolExample<Input, Output>;
export const otolithAnnulusEdgeStatusTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/otolith-annulus-edge-status-token",
    title: "Otolith Annulus Edge Status Token Tool",
    description:
      "Label an explicitly supplied otolith edge status without counting annuli or assigning age.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        edgeStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["complete", "partial", "uncertain", "not-assessed"],
        },
      },
      required: ["imageId", "edgeStatus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
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
          id: "edgeStatus",
          label: "Edge Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = otolithAnnulusEdgeStatusTokenTool.execute;
export default otolithAnnulusEdgeStatusTokenTool;
