import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bearingDegrees: number;
  readonly boundaryToken: string;
};
export type Output = {
  readonly quadrant: string;
  readonly onBoundary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bearingDegrees: { type: "number", minimum: 0, exclusiveMaximum: 360 },
    boundaryToken: { type: "string", maxLength: 8192 },
  },
  required: ["bearingDegrees", "boundaryToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quadrant: { type: "string", maxLength: 8192 },
    onBoundary: { type: "boolean" },
  },
  required: ["quadrant", "onBoundary"],
} as const;
/** Label a clockwise-from-north bearing quadrant with explicit axis-boundary labeling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bearingDegrees, boundaryToken } = request;
  const compute = (): Output => {
    H.domain(bearingDegrees >= 0 && bearingDegrees < 360);
    const onBoundary = bearingDegrees % 90 === 0;
    return {
      quadrant: onBoundary
        ? boundaryToken
        : ["NE", "SE", "SW", "NW"][Math.floor(bearingDegrees / 90)],
      onBoundary,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bearingDegrees: 45, boundaryToken: "axis" },
  output: { quadrant: "NE", onBoundary: false },
} satisfies ToolExample<Input, Output>;
export const bearingQuadrantTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/bearing-quadrant-token",
    title: "Bearing Quadrant Token Tool",
    description:
      "Label a clockwise-from-north bearing quadrant with explicit axis-boundary labeling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bearingDegrees: { type: "number", minimum: 0, exclusiveMaximum: 360 },
        boundaryToken: { type: "string", maxLength: 8192 },
      },
      required: ["bearingDegrees", "boundaryToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quadrant: { type: "string", maxLength: 8192 },
        onBoundary: { type: "boolean" },
      },
      required: ["quadrant", "onBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "bearingDegrees",
          label: "Bearing Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundaryToken",
          label: "Boundary Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "quadrant", label: "Quadrant", valueType: { type: "string" } },
        {
          id: "onBoundary",
          label: "On Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = bearingQuadrantTokenTool.execute;
export default bearingQuadrantTokenTool;
