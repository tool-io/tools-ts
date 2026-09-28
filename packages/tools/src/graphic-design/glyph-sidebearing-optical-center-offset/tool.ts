import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly advance: number;
  readonly leftBearing: number;
  readonly rightBearing: number;
};
export type Output = {
  readonly inkWidth: number;
  readonly geometricInkCenter: number;
  readonly advanceCenter: number;
  readonly centerOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    advance: { type: "number", minimum: 0 },
    leftBearing: { type: "number" },
    rightBearing: { type: "number" },
  },
  required: ["advance", "leftBearing", "rightBearing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inkWidth: { type: "number" },
    geometricInkCenter: { type: "number" },
    advanceCenter: { type: "number" },
    centerOffset: { type: "number" },
  },
  required: ["inkWidth", "geometricInkCenter", "advanceCenter", "centerOffset"],
} as const;
/** Bounding-box ink-center offset from advance center, not a perceptual optical-center estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { advance, leftBearing, rightBearing } = request;
  const compute = (): Output => {
    H.domain(advance >= 0 && advance - leftBearing - rightBearing >= 0);
    return {
      inkWidth: advance - leftBearing - rightBearing,
      geometricInkCenter:
        leftBearing + (advance - leftBearing - rightBearing) / 2,
      advanceCenter: advance / 2,
      centerOffset: (leftBearing - rightBearing) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { advance: 20, leftBearing: 2, rightBearing: 4 },
  output: {
    inkWidth: 14,
    geometricInkCenter: 9,
    advanceCenter: 10,
    centerOffset: -1,
  },
} satisfies ToolExample<Input, Output>;
export const glyphSidebearingOpticalCenterOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graphic-design/glyph-sidebearing-optical-center-offset",
      title: "Glyph Sidebearing Optical Center Offset Tool",
      description:
        "Bounding-box ink-center offset from advance center, not a perceptual optical-center estimate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          advance: { type: "number", minimum: 0 },
          leftBearing: { type: "number" },
          rightBearing: { type: "number" },
        },
        required: ["advance", "leftBearing", "rightBearing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inkWidth: { type: "number" },
          geometricInkCenter: { type: "number" },
          advanceCenter: { type: "number" },
          centerOffset: { type: "number" },
        },
        required: [
          "inkWidth",
          "geometricInkCenter",
          "advanceCenter",
          "centerOffset",
        ],
      },
      ports: {
        inputs: [
          {
            id: "advance",
            label: "Advance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "leftBearing",
            label: "Left Bearing",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rightBearing",
            label: "Right Bearing",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "inkWidth", label: "Ink Width", valueType: { type: "number" } },
          {
            id: "geometricInkCenter",
            label: "Geometric Ink Center",
            valueType: { type: "number" },
          },
          {
            id: "advanceCenter",
            label: "Advance Center",
            valueType: { type: "number" },
          },
          {
            id: "centerOffset",
            label: "Center Offset",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = glyphSidebearingOpticalCenterOffsetTool.execute;
export default glyphSidebearingOpticalCenterOffsetTool;
