import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly framedWidth: number;
  readonly artworkWidth: number;
  readonly framedHeight: number;
  readonly artworkHeight: number;
};
export type Output = {
  readonly horizontalPerSide: number;
  readonly verticalPerSide: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    framedWidth: { type: "number" },
    artworkWidth: { type: "number", minimum: 0 },
    framedHeight: { type: "number" },
    artworkHeight: { type: "number", minimum: 0 },
  },
  required: ["framedWidth", "artworkWidth", "framedHeight", "artworkHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalPerSide: { type: "number" },
    verticalPerSide: { type: "number" },
  },
  required: ["horizontalPerSide", "verticalPerSide"],
} as const;
/** Infer equal-side frame offsets from supplied outer and artwork dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { framedWidth, artworkWidth, framedHeight, artworkHeight } = request;
  const compute = (): Output => {
    H.domain(
      artworkWidth >= 0 &&
        artworkHeight >= 0 &&
        framedWidth >= artworkWidth &&
        framedHeight >= artworkHeight,
    );
    return {
      horizontalPerSide: (framedWidth - artworkWidth) / 2,
      verticalPerSide: (framedHeight - artworkHeight) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    framedWidth: 80,
    artworkWidth: 60,
    framedHeight: 100,
    artworkHeight: 70,
  },
  output: { horizontalPerSide: 10, verticalPerSide: 15 },
} satisfies ToolExample<Input, Output>;
export const artworkMeasurementFrameOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/artwork-measurement-frame-offset",
    title: "Artwork Measurement Frame Offset Tool",
    description:
      "Infer equal-side frame offsets from supplied outer and artwork dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        framedWidth: { type: "number" },
        artworkWidth: { type: "number", minimum: 0 },
        framedHeight: { type: "number" },
        artworkHeight: { type: "number", minimum: 0 },
      },
      required: [
        "framedWidth",
        "artworkWidth",
        "framedHeight",
        "artworkHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalPerSide: { type: "number" },
        verticalPerSide: { type: "number" },
      },
      required: ["horizontalPerSide", "verticalPerSide"],
    },
    ports: {
      inputs: [
        {
          id: "framedWidth",
          label: "Framed Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "artworkWidth",
          label: "Artwork Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "framedHeight",
          label: "Framed Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "artworkHeight",
          label: "Artwork Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "horizontalPerSide",
          label: "Horizontal Per Side",
          valueType: { type: "number" },
        },
        {
          id: "verticalPerSide",
          label: "Vertical Per Side",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artworkMeasurementFrameOffsetTool.execute;
export default artworkMeasurementFrameOffsetTool;
