import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentDistance: number;
  readonly radius: number;
};
export type Output = {
  readonly solidDistance: number;
  readonly signedSurfaceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentDistance: { type: "number", minimum: 0 },
    radius: { type: "number", minimum: 0 },
  },
  required: ["segmentDistance", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidDistance: { type: "number" },
    signedSurfaceGap: { type: "number" },
  },
  required: ["solidDistance", "signedSurfaceGap"],
} as const;
/** Calculate point to capsule radial excess from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentDistance, radius } = request;
  const compute = (): Output => {
    H.domain(segmentDistance >= 0 && radius >= 0);
    const signedSurfaceGap = segmentDistance - radius;
    return { solidDistance: Math.max(0, signedSurfaceGap), signedSurfaceGap };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segmentDistance: 5, radius: 2 },
  output: { solidDistance: 3, signedSurfaceGap: 3 },
} satisfies ToolExample<Input, Output>;
export const pointToCapsuleRadialExcessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/point-to-capsule-radial-excess",
    title: "Point To Capsule Radial Excess Tool",
    description:
      "Calculate point to capsule radial excess from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentDistance: { type: "number", minimum: 0 },
        radius: { type: "number", minimum: 0 },
      },
      required: ["segmentDistance", "radius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solidDistance: { type: "number" },
        signedSurfaceGap: { type: "number" },
      },
      required: ["solidDistance", "signedSurfaceGap"],
    },
    ports: {
      inputs: [
        {
          id: "segmentDistance",
          label: "Segment Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "solidDistance",
          label: "Solid Distance",
          valueType: { type: "number" },
        },
        {
          id: "signedSurfaceGap",
          label: "Signed Surface Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pointToCapsuleRadialExcessTool.execute;
export default pointToCapsuleRadialExcessTool;
