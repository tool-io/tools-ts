import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly distance: number; readonly radius: number };
export type Output = {
  readonly squaredLength: number;
  readonly exists: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    radius: { type: "number", minimum: 0 },
  },
  required: ["distance", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    squaredLength: { type: "number" },
    exists: { type: "boolean" },
  },
  required: ["squaredLength", "exists"],
} as const;
/** Calculate circle external tangent length squared gap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { distance, radius } = input;
  const compute = (): Output => {
    H.domain(distance >= 0 && radius >= 0);
    const squaredLength = distance * distance - radius * radius;
    return { squaredLength, exists: squaredLength >= 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { distance: 5, radius: 3 },
  output: { squaredLength: 16, exists: true },
} satisfies ToolExample<Input, Output>;
export const circleExternalTangentLengthSquaredGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geometry/circle-external-tangent-length-squared-gap",
      title: "Circle External Tangent Length Squared Gap Tool",
      description:
        "Calculate circle external tangent length squared gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", minimum: 0 },
          radius: { type: "number", minimum: 0 },
        },
        required: ["distance", "radius"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          squaredLength: { type: "number" },
          exists: { type: "boolean" },
        },
        required: ["squaredLength", "exists"],
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
            id: "squaredLength",
            label: "Squared Length",
            valueType: { type: "number" },
          },
          { id: "exists", label: "Exists", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = circleExternalTangentLengthSquaredGapTool.execute;
export default circleExternalTangentLengthSquaredGapTool;
