import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly latitudeRadians: number;
};
export type Output = {
  readonly distance: number;
  readonly latitudeDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    latitudeRadians: { type: "number" },
  },
  required: ["radius", "latitudeRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    latitudeDerivative: { type: "number" },
  },
  required: ["distance", "latitudeDerivative"],
} as const;
/** Signed spherical meridian distance from the equator and derivative with respect to latitude in radians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, latitudeRadians } = request;
  const compute = (): Output => {
    H.positive(radius);
    H.domain(Math.abs(latitudeRadians) <= Math.PI / 2);
    return { distance: radius * latitudeRadians, latitudeDerivative: radius };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 10, latitudeRadians: 0.5 },
  output: { distance: 5, latitudeDerivative: 10 },
} satisfies ToolExample<Input, Output>;
export const meridianDistanceLatitudeSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/meridian-distance-latitude-sensitivity",
      title: "Meridian Distance Latitude Sensitivity Tool",
      description:
        "Signed spherical meridian distance from the equator and derivative with respect to latitude in radians.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radius: { type: "number", exclusiveMinimum: 0 },
          latitudeRadians: { type: "number" },
        },
        required: ["radius", "latitudeRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number" },
          latitudeDerivative: { type: "number" },
        },
        required: ["distance", "latitudeDerivative"],
      },
      ports: {
        inputs: [
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
            valueType: { type: "number", unit: "rad" },
          },
        ],
        outputs: [
          { id: "distance", label: "Distance", valueType: { type: "number" } },
          {
            id: "latitudeDerivative",
            label: "Latitude Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = meridianDistanceLatitudeSensitivityTool.execute;
export default meridianDistanceLatitudeSensitivityTool;
