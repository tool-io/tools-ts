import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly secondX: number;
  readonly secondY: number;
  readonly bufferRadius: number;
};
export type Output = {
  readonly distance: number;
  readonly boundingWidth: number;
  readonly boundingHeight: number;
  readonly capsuleArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstX: { type: "number" },
    firstY: { type: "number" },
    secondX: { type: "number" },
    secondY: { type: "number" },
    bufferRadius: { type: "number", minimum: 0 },
  },
  required: ["firstX", "firstY", "secondX", "secondY", "bufferRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    boundingWidth: { type: "number" },
    boundingHeight: { type: "number" },
    capsuleArea: { type: "number" },
  },
  required: ["distance", "boundingWidth", "boundingHeight", "capsuleArea"],
} as const;
/** Planar capsule buffer around the segment joining two supplied locations; not a fitted home range or geodesic area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, secondX, secondY, bufferRadius } = request;
  const compute = (): Output => {
    H.domain(bufferRadius >= 0);
    return {
      distance: Math.hypot(secondX - firstX, secondY - firstY),
      boundingWidth: Math.abs(secondX - firstX) + 2 * bufferRadius,
      boundingHeight: Math.abs(secondY - firstY) + 2 * bufferRadius,
      capsuleArea:
        2 * bufferRadius * Math.hypot(secondX - firstX, secondY - firstY) +
        Math.PI * bufferRadius ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstX: 0, firstY: 0, secondX: 3, secondY: 4, bufferRadius: 1 },
  output: {
    distance: 5,
    boundingWidth: 5,
    boundingHeight: 6,
    capsuleArea: 13.141592653589793,
  },
} satisfies ToolExample<Input, Output>;
export const activitySpaceTwoLocationSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/activity-space-two-location-span",
    title: "Activity Space Two Location Span Tool",
    description:
      "Planar capsule buffer around the segment joining two supplied locations; not a fitted home range or geodesic area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstX: { type: "number" },
        firstY: { type: "number" },
        secondX: { type: "number" },
        secondY: { type: "number" },
        bufferRadius: { type: "number", minimum: 0 },
      },
      required: ["firstX", "firstY", "secondX", "secondY", "bufferRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        boundingWidth: { type: "number" },
        boundingHeight: { type: "number" },
        capsuleArea: { type: "number" },
      },
      required: ["distance", "boundingWidth", "boundingHeight", "capsuleArea"],
    },
    ports: {
      inputs: [
        {
          id: "firstX",
          label: "First X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstY",
          label: "First Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondX",
          label: "Second X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondY",
          label: "Second Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bufferRadius",
          label: "Buffer Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        {
          id: "boundingWidth",
          label: "Bounding Width",
          valueType: { type: "number" },
        },
        {
          id: "boundingHeight",
          label: "Bounding Height",
          valueType: { type: "number" },
        },
        {
          id: "capsuleArea",
          label: "Capsule Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = activitySpaceTwoLocationSpanTool.execute;
export default activitySpaceTwoLocationSpanTool;
