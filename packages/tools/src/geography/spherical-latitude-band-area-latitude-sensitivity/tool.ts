import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly latitudeRadians: number;
  readonly upperBoundary: boolean;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    latitudeRadians: { type: "number" },
    upperBoundary: { type: "boolean" },
  },
  required: ["radius", "latitudeRadians", "upperBoundary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate spherical latitude band area latitude sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, latitudeRadians, upperBoundary } = request;
  const compute = (): Output => {
    H.positive(radius);
    H.domain(Math.abs(latitudeRadians) <= Math.PI / 2);
    return {
      derivative:
        (upperBoundary ? 1 : -1) *
        2 *
        Math.PI *
        radius *
        radius *
        Math.cos(latitudeRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 2, latitudeRadians: 0, upperBoundary: true },
  output: { derivative: 25.132741228718345 },
} satisfies ToolExample<Input, Output>;
export const sphericalLatitudeBandAreaLatitudeSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/spherical-latitude-band-area-latitude-sensitivity",
      title: "Spherical Latitude Band Area Latitude Sensitivity Tool",
      description:
        "Calculate spherical latitude band area latitude sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          radius: { type: "number", exclusiveMinimum: 0 },
          latitudeRadians: { type: "number" },
          upperBoundary: { type: "boolean" },
        },
        required: ["radius", "latitudeRadians", "upperBoundary"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
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
            valueType: { type: "number" },
          },
          {
            id: "upperBoundary",
            label: "Upper Boundary",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sphericalLatitudeBandAreaLatitudeSensitivityTool.execute;
export default sphericalLatitudeBandAreaLatitudeSensitivityTool;
