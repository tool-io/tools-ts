import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly distance: number; readonly radius: number };
export type Output = {
  readonly centralAngle: number;
  readonly fractionOfCircumference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    radius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["distance", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centralAngle: { type: "number" },
    fractionOfCircumference: { type: "number" },
  },
  required: ["centralAngle", "fractionOfCircumference"],
} as const;
/** Calculate spherical distance central angle reference from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { distance, radius } = input;
  const compute = (): Output => {
    H.domain(distance >= 0);
    H.positive(radius);
    const centralAngle = distance / radius;
    H.domain(centralAngle <= Math.PI);
    return {
      centralAngle,
      fractionOfCircumference: centralAngle / (2 * Math.PI),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { distance: 3.141592653589793, radius: 2 },
  output: { centralAngle: 1.5707963267948966, fractionOfCircumference: 0.25 },
} satisfies ToolExample<Input, Output>;
export const sphericalDistanceCentralAngleReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/spherical-distance-central-angle-reference",
      title: "Spherical Distance Central Angle Reference Tool",
      description:
        "Calculate spherical distance central angle reference from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", minimum: 0 },
          radius: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["distance", "radius"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          centralAngle: { type: "number" },
          fractionOfCircumference: { type: "number" },
        },
        required: ["centralAngle", "fractionOfCircumference"],
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
            id: "radius",
            label: "Radius",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "centralAngle",
            label: "Central Angle",
            valueType: { type: "number" },
          },
          {
            id: "fractionOfCircumference",
            label: "Fraction Of Circumference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sphericalDistanceCentralAngleReferenceTool.execute;
export default sphericalDistanceCentralAngleReferenceTool;
