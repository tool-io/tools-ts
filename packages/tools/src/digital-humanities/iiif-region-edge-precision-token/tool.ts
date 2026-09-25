import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly extent: number;
  readonly imageExtent: number;
  readonly rounding: string;
};
export type Output = {
  readonly startPixel: number;
  readonly endPixel: number;
  readonly clipped: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    extent: { type: "number", minimum: 0 },
    imageExtent: { type: "integer", minimum: 1 },
    rounding: { type: "string", maxLength: 8192, enum: ["outward", "inward"] },
  },
  required: ["start", "extent", "imageExtent", "rounding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startPixel: { type: "integer" },
    endPixel: { type: "integer" },
    clipped: { type: "boolean" },
  },
  required: ["startPixel", "endPixel", "clipped"],
} as const;
/** Resolve one supplied pixel-region axis under explicit inward/outward rounding; not a full IIIF URI parser. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, extent, imageExtent, rounding } = request;
  const compute = (): Output => {
    H.integer(imageExtent, 1);
    H.domain(extent >= 0 && ["outward", "inward"].includes(rounding));
    const a = rounding === "outward" ? Math.floor(start) : Math.ceil(start),
      b =
        rounding === "outward"
          ? Math.ceil(start + extent)
          : Math.floor(start + extent);
    H.domain(b >= a);
    return {
      startPixel: Math.max(0, Math.min(imageExtent, a)),
      endPixel: Math.max(0, Math.min(imageExtent, b)),
      clipped: a < 0 || b > imageExtent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 1.2, extent: 3.6, imageExtent: 10, rounding: "outward" },
  output: { startPixel: 1, endPixel: 5, clipped: false },
} satisfies ToolExample<Input, Output>;
export const iiifRegionEdgePrecisionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/iiif-region-edge-precision-token",
    title: "IIIF Region Edge Precision Token Tool",
    description:
      "Resolve one supplied pixel-region axis under explicit inward/outward rounding; not a full IIIF URI parser.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "number" },
        extent: { type: "number", minimum: 0 },
        imageExtent: { type: "integer", minimum: 1 },
        rounding: {
          type: "string",
          maxLength: 8192,
          enum: ["outward", "inward"],
        },
      },
      required: ["start", "extent", "imageExtent", "rounding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startPixel: { type: "integer" },
        endPixel: { type: "integer" },
        clipped: { type: "boolean" },
      },
      required: ["startPixel", "endPixel", "clipped"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extent",
          label: "Extent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imageExtent",
          label: "Image Extent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rounding",
          label: "Rounding",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "startPixel",
          label: "Start Pixel",
          valueType: { type: "integer" },
        },
        { id: "endPixel", label: "End Pixel", valueType: { type: "integer" } },
        { id: "clipped", label: "Clipped", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = iiifRegionEdgePrecisionTokenTool.execute;
export default iiifRegionEdgePrecisionTokenTool;
