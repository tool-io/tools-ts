import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly oldRadius: number;
  readonly newRadius: number;
};
export type Output = { readonly distance: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    oldRadius: { type: "number", exclusiveMinimum: 0 },
    newRadius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["distance", "oldRadius", "newRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" }, ratio: { type: "number" } },
  required: ["distance", "ratio"],
} as const;
/** Rescale spherical arc distance at fixed central angle using explicitly supplied sphere radii. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, oldRadius, newRadius } = request;
  const compute = (): Output => {
    H.domain(distance >= 0);
    H.positive(oldRadius);
    H.positive(newRadius);
    const ratio = newRadius / oldRadius;
    return { distance: distance * ratio, ratio };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 20, oldRadius: 5, newRadius: 6 },
  output: { distance: 24, ratio: 1.2 },
} satisfies ToolExample<Input, Output>;
export const geodesicRadiusRelativeDistanceScaleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "distance/geodesic-radius-relative-distance-scale",
      title: "Geodesic Radius Relative Distance Scale Tool",
      description:
        "Rescale spherical arc distance at fixed central angle using explicitly supplied sphere radii.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", minimum: 0 },
          oldRadius: { type: "number", exclusiveMinimum: 0 },
          newRadius: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["distance", "oldRadius", "newRadius"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { distance: { type: "number" }, ratio: { type: "number" } },
        required: ["distance", "ratio"],
      },
      ports: {
        inputs: [
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldRadius",
            label: "Old Radius",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newRadius",
            label: "New Radius",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "distance", label: "Distance", valueType: { type: "number" } },
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = geodesicRadiusRelativeDistanceScaleTool.execute;
export default geodesicRadiusRelativeDistanceScaleTool;
