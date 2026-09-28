import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly floorWidth: number;
  readonly leftDivideElevation: number;
  readonly rightDivideElevation: number;
  readonly floorElevation: number;
};
export type Output = {
  readonly meanRelief: number;
  readonly widthHeightRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    floorWidth: { type: "number", minimum: 0 },
    leftDivideElevation: { type: "number" },
    rightDivideElevation: { type: "number" },
    floorElevation: { type: "number" },
  },
  required: [
    "floorWidth",
    "leftDivideElevation",
    "rightDivideElevation",
    "floorElevation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanRelief: { type: "number" },
    widthHeightRatio: { type: "number" },
  },
  required: ["meanRelief", "widthHeightRatio"],
} as const;
/** Valley floor width-to-height ratio Vf=2Vfw/[(Eld-Esc)+(Erd-Esc)] under the supplied divide elevations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    floorWidth,
    leftDivideElevation,
    rightDivideElevation,
    floorElevation,
  } = request;
  const compute = (): Output => {
    H.domain(
      floorWidth >= 0 &&
        leftDivideElevation >= floorElevation &&
        rightDivideElevation >= floorElevation &&
        leftDivideElevation + rightDivideElevation > 2 * floorElevation,
    );
    return {
      meanRelief:
        (leftDivideElevation + rightDivideElevation - 2 * floorElevation) / 2,
      widthHeightRatio:
        (2 * floorWidth) /
        (leftDivideElevation + rightDivideElevation - 2 * floorElevation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    floorWidth: 100,
    leftDivideElevation: 200,
    rightDivideElevation: 180,
    floorElevation: 100,
  },
  output: { meanRelief: 90, widthHeightRatio: 1.1111111111111112 },
} satisfies ToolExample<Input, Output>;
export const valleyWidthDepthRelativeIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/valley-width-depth-relative-index",
    title: "Valley Width Depth Relative Index Tool",
    description:
      "Valley floor width-to-height ratio Vf=2Vfw/[(Eld-Esc)+(Erd-Esc)] under the supplied divide elevations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        floorWidth: { type: "number", minimum: 0 },
        leftDivideElevation: { type: "number" },
        rightDivideElevation: { type: "number" },
        floorElevation: { type: "number" },
      },
      required: [
        "floorWidth",
        "leftDivideElevation",
        "rightDivideElevation",
        "floorElevation",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanRelief: { type: "number" },
        widthHeightRatio: { type: "number" },
      },
      required: ["meanRelief", "widthHeightRatio"],
    },
    ports: {
      inputs: [
        {
          id: "floorWidth",
          label: "Floor Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftDivideElevation",
          label: "Left Divide Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightDivideElevation",
          label: "Right Divide Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "floorElevation",
          label: "Floor Elevation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meanRelief",
          label: "Mean Relief",
          valueType: { type: "number" },
        },
        {
          id: "widthHeightRatio",
          label: "Width Height Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = valleyWidthDepthRelativeIndexTool.execute;
export default valleyWidthDepthRelativeIndexTool;
