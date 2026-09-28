import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly radius: number; readonly height: number };
export type Output = { readonly halfAngle: number; readonly apexAngle: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    height: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["radius", "height"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { halfAngle: { type: "number" }, apexAngle: { type: "number" } },
  required: ["halfAngle", "apexAngle"],
} as const;
/** Calculate cone apex angle radius height from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { radius, height } = input;
  const compute = (): Output => {
    H.domain(radius >= 0);
    H.positive(height);
    const halfAngle = Math.atan2(radius, height);
    return { halfAngle, apexAngle: 2 * halfAngle };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radius: 3, height: 3 },
  output: { halfAngle: 0.7853981633974483, apexAngle: 1.5707963267948966 },
} satisfies ToolExample<Input, Output>;
export const coneApexAngleRadiusHeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/cone-apex-angle-radius-height",
    title: "Cone Apex Angle Radius Height Tool",
    description:
      "Calculate cone apex angle radius height from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        height: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["radius", "height"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        halfAngle: { type: "number" },
        apexAngle: { type: "number" },
      },
      required: ["halfAngle", "apexAngle"],
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
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "halfAngle", label: "Half Angle", valueType: { type: "number" } },
        { id: "apexAngle", label: "Apex Angle", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = coneApexAngleRadiusHeightTool.execute;
export default coneApexAngleRadiusHeightTool;
