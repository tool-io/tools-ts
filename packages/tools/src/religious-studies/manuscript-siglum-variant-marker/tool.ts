import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siglum: string;
  readonly marker: string;
  readonly allowedMarkers: readonly string[];
};
export type Output = { readonly recognized: boolean; readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siglum: { type: "string", maxLength: 8192 },
    marker: { type: "string", maxLength: 8192 },
    allowedMarkers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["siglum", "marker", "allowedMarkers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["recognized", "key"],
} as const;
/** Retain a manuscript siglum and supplied variant marker without identifying a witness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { siglum, marker, allowedMarkers } = request;
  const compute = (): Output => {
    H.domain(siglum.length > 0);
    return {
      recognized: allowedMarkers.includes(marker),
      key: JSON.stringify([siglum, marker]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { siglum: "A", marker: "*", allowedMarkers: ["*", "c"] },
  output: { recognized: true, key: '["A","*"]' },
} satisfies ToolExample<Input, Output>;
export const manuscriptSiglumVariantMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/manuscript-siglum-variant-marker",
    title: "Manuscript Siglum Variant Marker Tool",
    description:
      "Retain a manuscript siglum and supplied variant marker without identifying a witness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siglum: { type: "string", maxLength: 8192 },
        marker: { type: "string", maxLength: 8192 },
        allowedMarkers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["siglum", "marker", "allowedMarkers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["recognized", "key"],
    },
    ports: {
      inputs: [
        {
          id: "siglum",
          label: "Siglum",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "marker",
          label: "Marker",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedMarkers",
          label: "Allowed Markers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = manuscriptSiglumVariantMarkerTool.execute;
export default manuscriptSiglumVariantMarkerTool;
