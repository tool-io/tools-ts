import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftDepth: number;
  readonly rightDepth: number;
  readonly horizontalWidth: number;
  readonly includeLeftWall: boolean;
  readonly includeRightWall: boolean;
};
export type Output = {
  readonly bedLength: number;
  readonly wettedPerimeter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftDepth: { type: "number", minimum: 0 },
    rightDepth: { type: "number", minimum: 0 },
    horizontalWidth: { type: "number", minimum: 0 },
    includeLeftWall: { type: "boolean" },
    includeRightWall: { type: "boolean" },
  },
  required: [
    "leftDepth",
    "rightDepth",
    "horizontalWidth",
    "includeLeftWall",
    "includeRightWall",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedLength: { type: "number" },
    wettedPerimeter: { type: "number" },
  },
  required: ["bedLength", "wettedPerimeter"],
} as const;
/** One straight bed panel plus explicitly included vertical sidewalls; interior panel boundaries should not be counted as wetted walls. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    leftDepth,
    rightDepth,
    horizontalWidth,
    includeLeftWall,
    includeRightWall,
  } = request;
  const compute = (): Output => {
    H.domain(leftDepth >= 0 && rightDepth >= 0 && horizontalWidth >= 0);
    return {
      bedLength: Math.hypot(horizontalWidth, rightDepth - leftDepth),
      wettedPerimeter:
        Math.hypot(horizontalWidth, rightDepth - leftDepth) +
        (includeLeftWall ? leftDepth : 0) +
        (includeRightWall ? rightDepth : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    leftDepth: 1,
    rightDepth: 1,
    horizontalWidth: 4,
    includeLeftWall: true,
    includeRightWall: true,
  },
  output: { bedLength: 4, wettedPerimeter: 6 },
} satisfies ToolExample<Input, Output>;
export const openChannelWettedPerimeterPanelTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrology/open-channel-wetted-perimeter-panel-term",
      title: "Open Channel Wetted Perimeter Panel Term Tool",
      description:
        "One straight bed panel plus explicitly included vertical sidewalls; interior panel boundaries should not be counted as wetted walls.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leftDepth: { type: "number", minimum: 0 },
          rightDepth: { type: "number", minimum: 0 },
          horizontalWidth: { type: "number", minimum: 0 },
          includeLeftWall: { type: "boolean" },
          includeRightWall: { type: "boolean" },
        },
        required: [
          "leftDepth",
          "rightDepth",
          "horizontalWidth",
          "includeLeftWall",
          "includeRightWall",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bedLength: { type: "number" },
          wettedPerimeter: { type: "number" },
        },
        required: ["bedLength", "wettedPerimeter"],
      },
      ports: {
        inputs: [
          {
            id: "leftDepth",
            label: "Left Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rightDepth",
            label: "Right Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "horizontalWidth",
            label: "Horizontal Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeLeftWall",
            label: "Include Left Wall",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "includeRightWall",
            label: "Include Right Wall",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "bedLength",
            label: "Bed Length",
            valueType: { type: "number" },
          },
          {
            id: "wettedPerimeter",
            label: "Wetted Perimeter",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = openChannelWettedPerimeterPanelTermTool.execute;
export default openChannelWettedPerimeterPanelTermTool;
