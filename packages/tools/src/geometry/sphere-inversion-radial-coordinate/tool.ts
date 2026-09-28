import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly radius: number; readonly distance: number };
export type Output = { readonly invertedDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    distance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["radius", "distance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { invertedDistance: { type: "number" } },
  required: ["invertedDistance"],
} as const;
/** Calculate sphere inversion radial coordinate from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { radius, distance } = input;
  const compute = (): Output => {
    H.positive(radius);
    H.positive(distance);
    return { invertedDistance: (radius * radius) / distance };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radius: 4, distance: 8 },
  output: { invertedDistance: 2 },
} satisfies ToolExample<Input, Output>;
export const sphereInversionRadialCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/sphere-inversion-radial-coordinate",
    title: "Sphere Inversion Radial Coordinate Tool",
    description:
      "Calculate sphere inversion radial coordinate from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        distance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["radius", "distance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { invertedDistance: { type: "number" } },
      required: ["invertedDistance"],
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
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "invertedDistance",
          label: "Inverted Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sphereInversionRadialCoordinateTool.execute;
export default sphereInversionRadialCoordinateTool;
