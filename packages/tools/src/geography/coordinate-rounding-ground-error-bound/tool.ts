import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angularStepRadians: number;
  readonly radius: number;
  readonly latitudeRadians: number;
};
export type Output = {
  readonly latitudeHalfwidth: number;
  readonly longitudeHalfwidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularStepRadians: { type: "number", minimum: 0 },
    radius: { type: "number", exclusiveMinimum: 0 },
    latitudeRadians: { type: "number" },
  },
  required: ["angularStepRadians", "radius", "latitudeRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitudeHalfwidth: { type: "number" },
    longitudeHalfwidth: { type: "number" },
  },
  required: ["latitudeHalfwidth", "longitudeHalfwidth"],
} as const;
/** Calculate coordinate rounding ground error bound from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angularStepRadians, radius, latitudeRadians } = request;
  const compute = (): Output => {
    H.domain(
      angularStepRadians >= 0 && Math.abs(latitudeRadians) <= Math.PI / 2,
    );
    H.positive(radius);
    const latitudeHalfwidth = (radius * angularStepRadians) / 2;
    return {
      latitudeHalfwidth,
      longitudeHalfwidth: latitudeHalfwidth * Math.cos(latitudeRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angularStepRadians: 0.001, radius: 6000000, latitudeRadians: 0 },
  output: { latitudeHalfwidth: 3000, longitudeHalfwidth: 3000 },
} satisfies ToolExample<Input, Output>;
export const coordinateRoundingGroundErrorBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/coordinate-rounding-ground-error-bound",
    title: "Coordinate Rounding Ground Error Bound Tool",
    description:
      "Calculate coordinate rounding ground error bound from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularStepRadians: { type: "number", minimum: 0 },
        radius: { type: "number", exclusiveMinimum: 0 },
        latitudeRadians: { type: "number" },
      },
      required: ["angularStepRadians", "radius", "latitudeRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latitudeHalfwidth: { type: "number" },
        longitudeHalfwidth: { type: "number" },
      },
      required: ["latitudeHalfwidth", "longitudeHalfwidth"],
    },
    ports: {
      inputs: [
        {
          id: "angularStepRadians",
          label: "Angular Step Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latitudeRadians",
          label: "Latitude Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "latitudeHalfwidth",
          label: "Latitude Halfwidth",
          valueType: { type: "number" },
        },
        {
          id: "longitudeHalfwidth",
          label: "Longitude Halfwidth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coordinateRoundingGroundErrorBoundTool.execute;
export default coordinateRoundingGroundErrorBoundTool;
