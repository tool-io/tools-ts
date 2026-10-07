import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marker: readonly number[];
  readonly origin: readonly number[];
};
export type Output = { readonly relative: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marker: { type: "array", maxItems: 256, items: { type: "number" } },
    origin: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["marker", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relative: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["relative"],
} as const;
/** Translate one 3D marker into coordinates relative to a supplied segment origin; no segment rotation is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marker, origin } = request;
  const compute = (): Output => {
    H.domain(marker.length === origin.length, "origin");
    H.domain(marker.length === 3, "marker");
    return { relative: marker.map((v, i) => v - origin[i]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marker: [10, 20, 30], origin: [2, 5, 10] },
  output: { relative: [8, 15, 20] },
} satisfies ToolExample<Input, Output>;
export const markerSegmentRelativeCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/marker-segment-relative-coordinate",
    title: "Marker Segment Relative Coordinate",
    description:
      "Translate one 3D marker into coordinates relative to a supplied segment origin; no segment rotation is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marker: { type: "array", maxItems: 256, items: { type: "number" } },
        origin: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["marker", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relative: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["relative"],
    },
    ports: {
      inputs: [
        {
          id: "marker",
          label: "Marker",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "relative",
          label: "Relative",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = markerSegmentRelativeCoordinateTool.execute;
export default markerSegmentRelativeCoordinateTool;
