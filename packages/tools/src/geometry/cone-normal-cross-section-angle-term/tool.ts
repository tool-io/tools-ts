import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly radius: number; readonly height: number };
export type Output = {
  readonly axisAngleRadians: number;
  readonly normalAngleRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["radius", "height"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisAngleRadians: { type: "number" },
    normalAngleRadians: { type: "number" },
  },
  required: ["axisAngleRadians", "normalAngleRadians"],
} as const;
/** Compute cone normal cross section angle term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { radius, height } = input;
  const compute = (): Output => {
    positive(radius);
    positive(height);
    return {
      axisAngleRadians: Math.atan2(radius, height),
      normalAngleRadians: Math.atan2(height, radius),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radius: 1, height: 1 },
  output: {
    axisAngleRadians: 0.7853981633974483,
    normalAngleRadians: 0.7853981633974483,
  },
} satisfies ToolExample<Input, Output>;
export const coneNormalCrossSectionAngleTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geometry/cone-normal-cross-section-angle-term",
  title: "Cone Normal Cross Section Angle Term Tool",
  description:
    "Compute cone normal cross section angle term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "radius",
        label: "Radius",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "height",
        label: "Height",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "axisAngleRadians",
        label: "Axis Angle Radians",
        valueType: { type: "number" },
      },
      {
        id: "normalAngleRadians",
        label: "Normal Angle Radians",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = coneNormalCrossSectionAngleTermTool.execute;
export default coneNormalCrossSectionAngleTermTool;
