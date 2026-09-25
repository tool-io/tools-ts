import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly latitude: number;
  readonly longitudeDifference: number;
};
export type Output = { readonly chord: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    latitude: { type: "number" },
    longitudeDifference: { type: "number" },
  },
  required: ["radius", "latitude", "longitudeDifference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chord: { type: "number" } },
  required: ["chord"],
} as const;
/** Return the straight chord between equal-latitude sphere points; angles are radians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, latitude, longitudeDifference } = request;
  const compute = (): Output => {
    H.positive(radius);
    H.domain(Math.abs(latitude) <= Math.PI / 2);
    return {
      chord:
        2 *
        radius *
        Math.cos(latitude) *
        Math.abs(Math.sin(longitudeDifference / 2)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 5, latitude: 0, longitudeDifference: 3.141592653589793 },
  output: { chord: 10 },
} satisfies ToolExample<Input, Output>;
export const sphericalSurfaceSameLatitudeChordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/spherical-surface-same-latitude-chord",
    title: "Spherical Surface Same Latitude Chord Tool",
    description:
      "Return the straight chord between equal-latitude sphere points; angles are radians.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        latitude: { type: "number" },
        longitudeDifference: { type: "number" },
      },
      required: ["radius", "latitude", "longitudeDifference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { chord: { type: "number" } },
      required: ["chord"],
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
          id: "latitude",
          label: "Latitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "longitudeDifference",
          label: "Longitude Difference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "chord", label: "Chord", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = sphericalSurfaceSameLatitudeChordTool.execute;
export default sphericalSurfaceSameLatitudeChordTool;
