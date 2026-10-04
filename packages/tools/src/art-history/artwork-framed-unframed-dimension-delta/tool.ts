import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly framedWidth: number;
  readonly framedHeight: number;
  readonly artworkWidth: number;
  readonly artworkHeight: number;
};
export type Output = {
  readonly widthAdded: number;
  readonly heightAdded: number;
  readonly averageSideBorder: number;
  readonly averageTopBottomBorder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    framedWidth: { type: "number" },
    framedHeight: { type: "number" },
    artworkWidth: { type: "number", minimum: 0 },
    artworkHeight: { type: "number", minimum: 0 },
  },
  required: ["framedWidth", "framedHeight", "artworkWidth", "artworkHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    widthAdded: { type: "number" },
    heightAdded: { type: "number" },
    averageSideBorder: { type: "number" },
    averageTopBottomBorder: { type: "number" },
  },
  required: [
    "widthAdded",
    "heightAdded",
    "averageSideBorder",
    "averageTopBottomBorder",
  ],
} as const;
/** Compare external framed dimensions with artwork dimensions; half-deltas are average borders and do not assert centered mounting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { framedWidth, framedHeight, artworkWidth, artworkHeight } = request;
  const compute = (): Output => {
    H.domain(
      artworkWidth >= 0 &&
        artworkHeight >= 0 &&
        framedWidth >= artworkWidth &&
        framedHeight >= artworkHeight,
      "artworkWidth",
    );
    return {
      widthAdded: framedWidth - artworkWidth,
      heightAdded: framedHeight - artworkHeight,
      averageSideBorder: (framedWidth - artworkWidth) / 2,
      averageTopBottomBorder: (framedHeight - artworkHeight) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    framedWidth: 70,
    framedHeight: 90,
    artworkWidth: 50,
    artworkHeight: 60,
  },
  output: {
    widthAdded: 20,
    heightAdded: 30,
    averageSideBorder: 10,
    averageTopBottomBorder: 15,
  },
} satisfies ToolExample<Input, Output>;
export const artworkFramedUnframedDimensionDeltaTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-history/artwork-framed-unframed-dimension-delta",
      title: "Artwork Framed Unframed Dimension Delta Tool",
      description:
        "Compare external framed dimensions with artwork dimensions; half-deltas are average borders and do not assert centered mounting.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          framedWidth: { type: "number" },
          framedHeight: { type: "number" },
          artworkWidth: { type: "number", minimum: 0 },
          artworkHeight: { type: "number", minimum: 0 },
        },
        required: [
          "framedWidth",
          "framedHeight",
          "artworkWidth",
          "artworkHeight",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          widthAdded: { type: "number" },
          heightAdded: { type: "number" },
          averageSideBorder: { type: "number" },
          averageTopBottomBorder: { type: "number" },
        },
        required: [
          "widthAdded",
          "heightAdded",
          "averageSideBorder",
          "averageTopBottomBorder",
        ],
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
            id: "framedHeight",
            label: "Framed Height",
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
            id: "artworkHeight",
            label: "Artwork Height",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "widthAdded",
            label: "Width Added",
            valueType: { type: "number" },
          },
          {
            id: "heightAdded",
            label: "Height Added",
            valueType: { type: "number" },
          },
          {
            id: "averageSideBorder",
            label: "Average Side Border",
            valueType: { type: "number" },
          },
          {
            id: "averageTopBottomBorder",
            label: "Average Top Bottom Border",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = artworkFramedUnframedDimensionDeltaTool.execute;
export default artworkFramedUnframedDimensionDeltaTool;
