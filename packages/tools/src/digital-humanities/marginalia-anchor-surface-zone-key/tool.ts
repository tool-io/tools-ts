import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly surfaceId: string;
  readonly zoneId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    surfaceId: { type: "string", maxLength: 8192, minLength: 1 },
    zoneId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["documentId", "surfaceId", "zoneId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an explicit document, surface and zone marginalia anchor without resolving facsimile geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, surfaceId, zoneId } = request;
  const compute = (): Output => {
    H.domain(documentId.length > 0, "documentId");
    H.domain(surfaceId.length > 0, "surfaceId");
    H.domain(zoneId.length > 0, "zoneId");
    return { token: JSON.stringify([documentId, surfaceId, zoneId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentId: "D17", surfaceId: "S4", zoneId: "Z2" },
  output: { token: '["D17","S4","Z2"]' },
} satisfies ToolExample<Input, Output>;
export const marginaliaAnchorSurfaceZoneKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/marginalia-anchor-surface-zone-key",
    title: "Marginalia Anchor Surface Zone Key Tool",
    description:
      "Encode an explicit document, surface and zone marginalia anchor without resolving facsimile geometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        surfaceId: { type: "string", maxLength: 8192, minLength: 1 },
        zoneId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["documentId", "surfaceId", "zoneId"],
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
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "surfaceId",
          label: "Surface Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "zoneId",
          label: "Zone Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = marginaliaAnchorSurfaceZoneKeyTool.execute;
export default marginaliaAnchorSurfaceZoneKeyTool;
