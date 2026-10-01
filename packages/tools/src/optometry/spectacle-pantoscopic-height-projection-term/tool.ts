import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly height: number;
  readonly tiltRadians: number;
  readonly pivotHeight: number;
};
export type Output = {
  readonly projectedHeight: number;
  readonly forwardOffset: number;
  readonly displacement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number" },
    tiltRadians: { type: "number" },
    pivotHeight: { type: "number" },
  },
  required: ["height", "tiltRadians", "pivotHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectedHeight: { type: "number" },
    forwardOffset: { type: "number" },
    displacement: { type: "number" },
  },
  required: ["projectedHeight", "forwardOffset", "displacement"],
} as const;
/** Rigid planar tilt of a supplied frame height about an explicit pivot. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, tiltRadians, pivotHeight } = request;
  const compute = (): Output => {
    return {
      projectedHeight:
        pivotHeight + (height - pivotHeight) * Math.cos(tiltRadians),
      forwardOffset: (height - pivotHeight) * Math.sin(tiltRadians),
      displacement: (height - pivotHeight) * (Math.cos(tiltRadians) - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { height: 20, tiltRadians: 0, pivotHeight: 5 },
  output: { projectedHeight: 20, forwardOffset: 0, displacement: 0 },
} satisfies ToolExample<Input, Output>;
export const spectaclePantoscopicHeightProjectionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "optometry/spectacle-pantoscopic-height-projection-term",
      title: "Spectacle Pantoscopic Height Projection Term Tool",
      description:
        "Rigid planar tilt of a supplied frame height about an explicit pivot.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          height: { type: "number" },
          tiltRadians: { type: "number" },
          pivotHeight: { type: "number" },
        },
        required: ["height", "tiltRadians", "pivotHeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          projectedHeight: { type: "number" },
          forwardOffset: { type: "number" },
          displacement: { type: "number" },
        },
        required: ["projectedHeight", "forwardOffset", "displacement"],
      },
      ports: {
        inputs: [
          {
            id: "height",
            label: "Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tiltRadians",
            label: "Tilt Radians",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pivotHeight",
            label: "Pivot Height",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "projectedHeight",
            label: "Projected Height",
            valueType: { type: "number" },
          },
          {
            id: "forwardOffset",
            label: "Forward Offset",
            valueType: { type: "number" },
          },
          {
            id: "displacement",
            label: "Displacement",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = spectaclePantoscopicHeightProjectionTermTool.execute;
export default spectaclePantoscopicHeightProjectionTermTool;
