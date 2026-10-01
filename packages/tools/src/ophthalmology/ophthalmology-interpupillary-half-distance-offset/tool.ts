import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalDistance: number;
  readonly rightDistance: number;
  readonly leftDistance: number;
};
export type Output = {
  readonly halfDistance: number;
  readonly rightOffset: number;
  readonly leftOffset: number;
  readonly closureGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalDistance: { type: "number", minimum: 0 },
    rightDistance: { type: "number", minimum: 0 },
    leftDistance: { type: "number", minimum: 0 },
  },
  required: ["totalDistance", "rightDistance", "leftDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    halfDistance: { type: "number" },
    rightOffset: { type: "number" },
    leftOffset: { type: "number" },
    closureGap: { type: "number" },
  },
  required: ["halfDistance", "rightOffset", "leftOffset", "closureGap"],
} as const;
/** Compare explicit total and monocular distance records, without selecting a spectacle fit or determining patient measurements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalDistance, rightDistance, leftDistance } = request;
  const compute = (): Output => {
    H.domain(totalDistance >= 0 && rightDistance >= 0 && leftDistance >= 0);
    return {
      halfDistance: totalDistance / 2,
      rightOffset: rightDistance - totalDistance / 2,
      leftOffset: leftDistance - totalDistance / 2,
      closureGap: rightDistance + leftDistance - totalDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalDistance: 64, rightDistance: 33, leftDistance: 31 },
  output: { halfDistance: 32, rightOffset: 1, leftOffset: -1, closureGap: 0 },
} satisfies ToolExample<Input, Output>;
export const ophthalmologyInterpupillaryHalfDistanceOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ophthalmology/ophthalmology-interpupillary-half-distance-offset",
      title: "Ophthalmology Interpupillary Half Distance Offset Tool",
      description:
        "Compare explicit total and monocular distance records, without selecting a spectacle fit or determining patient measurements.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalDistance: { type: "number", minimum: 0 },
          rightDistance: { type: "number", minimum: 0 },
          leftDistance: { type: "number", minimum: 0 },
        },
        required: ["totalDistance", "rightDistance", "leftDistance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          halfDistance: { type: "number" },
          rightOffset: { type: "number" },
          leftOffset: { type: "number" },
          closureGap: { type: "number" },
        },
        required: ["halfDistance", "rightOffset", "leftOffset", "closureGap"],
      },
      ports: {
        inputs: [
          {
            id: "totalDistance",
            label: "Total Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rightDistance",
            label: "Right Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "leftDistance",
            label: "Left Distance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "halfDistance",
            label: "Half Distance",
            valueType: { type: "number" },
          },
          {
            id: "rightOffset",
            label: "Right Offset",
            valueType: { type: "number" },
          },
          {
            id: "leftOffset",
            label: "Left Offset",
            valueType: { type: "number" },
          },
          {
            id: "closureGap",
            label: "Closure Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ophthalmologyInterpupillaryHalfDistanceOffsetTool.execute;
export default ophthalmologyInterpupillaryHalfDistanceOffsetTool;
